import {
  users,
  posts,
  likes,
  comments,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type PostWithAuthor,
  type Comment,
  type InsertComment,
  type CommentWithAuthor,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPosts(userId?: string): Promise<PostWithAuthor[]>;
  getPost(id: number): Promise<PostWithAuthor | undefined>;
  
  // Like operations
  toggleLike(postId: number, userId: string): Promise<boolean>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getComments(postId: number): Promise<CommentWithAuthor[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }

  async getPosts(userId?: string): Promise<PostWithAuthor[]> {
    const postsWithDetails = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        authorId: posts.authorId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
        likeCount: sql<number>`count(distinct ${likes.id})::int`,
        commentCount: sql<number>`count(distinct ${comments.id})::int`,
        isLiked: sql<boolean>`bool_or(${likes.userId} = ${userId || null})`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .groupBy(posts.id, users.id)
      .orderBy(desc(posts.createdAt));

    return postsWithDetails;
  }

  async getPost(id: number): Promise<PostWithAuthor | undefined> {
    const [postWithDetails] = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        authorId: posts.authorId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
        likeCount: sql<number>`count(distinct ${likes.id})::int`,
        commentCount: sql<number>`count(distinct ${comments.id})::int`,
        isLiked: sql<boolean>`false`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(eq(posts.id, id))
      .groupBy(posts.id, users.id);

    return postWithDetails;
  }

  // Like operations
  async toggleLike(postId: number, userId: string): Promise<boolean> {
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
      return false;
    } else {
      // Like
      await db
        .insert(likes)
        .values({ postId, userId });
      return true;
    }
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  async getComments(postId: number): Promise<CommentWithAuthor[]> {
    const commentsWithUsers = await db
      .select({
        id: comments.id,
        content: comments.content,
        postId: comments.postId,
        userId: comments.userId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        user: users,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return commentsWithUsers;
  }
}

export const storage = new DatabaseStorage();
