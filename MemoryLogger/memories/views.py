# memories/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import connection 
from .models import Memory
from .serializers import MemorySerializer
from .nlp_service import process_memory_text, get_embedding 
from scipy.spatial.distance import cosine # <-- REQUIRED for fallback search
import numpy as np # <-- REQUIRED for vector math

class MemoryViewSet(viewsets.ModelViewSet):
    """
    Handles standard CRUD for Memories and includes custom endpoints for AI processing and search.
    """
    serializer_class = MemorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Returns only the memories belonging to the authenticated user."""
        return Memory.objects.filter(user=self.request.user)

    # --- 1. OVERRIDE CREATE (POST) for NLP Processing ---
    def create(self, request, *args, **kwargs):
        """
        Creates a new memory, running it through the NLP service first.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        text_content = serializer.validated_data['text_content']
        
        try:
            # --- AI/NLP Logic Execution ---
            nlp_data = process_memory_text(text_content) 
            
            # Save the memory with the generated data
            memory = Memory.objects.create(
                user=request.user,
                text_content=text_content,
                emotion_label=nlp_data['emotion_label'],
                embedding=nlp_data['embedding']
            )
            
            return Response(MemorySerializer(memory).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            # Catch errors from NLP service (e.g., model loading failure)
            return Response({"error": f"Failed to process memory with AI: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # --- 2. CUSTOM ACTION FOR SEMANTIC SEARCH (POST /api/memories/search_semantic/) ---
    @action(detail=False, methods=['post'], url_path='search-semantic')
    def search_semantic(self, request):
        """
        Performs vector similarity search against stored embeddings using
        a Python-based fallback, compatible with SQLite.
        """
        query_text = request.data.get('query')
        limit = int(request.data.get('limit', 5)) 

        if not query_text:
            return Response({"error": "The 'query' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Generate embedding of search query
        try:
            query_embedding_list = get_embedding(query_text)
            # Ensure the vector is non-empty before converting to NumPy array
            if not query_embedding_list:
                raise ValueError("Embedding generation returned an empty vector.")
            query_embedding = np.array(query_embedding_list)
        except Exception as e:
            return Response({"error": f"Failed to generate query embedding: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 2. Retrieve all memories for the user
        user_memories = self.get_queryset()
        
        # 3. Python-Based Similarity Search (SQLite Fallback Logic)
        scored_memories = []

        for memory in user_memories:
            # Ensure the memory has a valid embedding stored as a list
            if memory.embedding and isinstance(memory.embedding, list) and len(memory.embedding) > 0:
                
                # Calculate cosine similarity: 1 - cosine_distance
                try:
                    memory_vector = np.array(memory.embedding)
                    score = 1 - cosine(query_embedding, memory_vector)
                    
                    if not np.isnan(score):
                         scored_memories.append((score, memory))
                except Exception:
                    # Skip memories with malformed or incompatible vectors
                    continue
        
        # 4. Sort by similarity score (descending) and take the top N
        scored_memories.sort(key=lambda x: x[0], reverse=True)
        top_memories = [memory for score, memory in scored_memories[:limit]]
        
        # 5. Serialize and return results
        serializer = self.get_serializer(top_memories, many=True)
        return Response({
            "results": serializer.data,
            "search_method": "Python/SciPy Cosine Similarity (SQLite Compatible)"
        })