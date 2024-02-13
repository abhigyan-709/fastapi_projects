from pydantic import BaseModel, Field
from typing import List, Optional
from models.input import User

class CategoryModel(BaseModel):
    id: Optional[int]
    name: Optional[str]

class TagModel(BaseModel):
    id: Optional[int]
    name: Optional[str]

class PhotoModel(BaseModel):
    id: Optional[int]
    caption: Optional[str]
    image_file: Optional[str]

class LikeDislikeModel(BaseModel):
    id: Optional[int]
    liked_by: Optional[User]
    disliked_by: Optional[User]

class RatingModel(BaseModel):
    id: Optional[int]
    rated_by: Optional[User]
    rating: Optional[int]


class NewsArticleModel(BaseModel):
    id: Optional[int]
    title: Optional[str]
    content: Optional[str]
    author: Optional[User]
    category: Optional[CategoryModel]
    tags: Optional[List[TagModel]]
    published_date: Optional[str]
    is_published: Optional[bool]
    featured_photo: Optional[PhotoModel]

class CommentModel(BaseModel):
    id: Optional[int]
    news_article: Optional[NewsArticleModel]
    author: Optional[User]
    content: Optional[str]
    created_date: Optional[str]


