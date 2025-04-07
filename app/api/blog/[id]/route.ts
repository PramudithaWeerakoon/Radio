import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get a specific blog post by ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const idParam = context.params.id;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const blog = await prisma.blog.findUnique({
      where: { id },
    });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// Delete a blog post
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const idParam = context.params.id;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    // Check if the blog post exists
    const blogExists = await prisma.blog.findUnique({
      where: { id },
    });
    
    if (!blogExists) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Delete the blog post
    await prisma.blog.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { success: true, message: 'Blog post deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
