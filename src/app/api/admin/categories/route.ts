import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/utils/auth-server';

// In a real application, you would connect to a database
// For this implementation, we'll use an in-memory solution
// In production, you'd want to use a proper database like PostgreSQL or MySQL

let categories: Array<{id: number, name: string, imageCount?: number}> = [
  { id: 1, name: 'Wedding', imageCount: 10 },
  { id: 2, name: 'Fashion', imageCount: 8 },
  { id: 3, name: 'Bridal', imageCount: 15 },
];

let nextId = 4;

export async function GET(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    // In a real application, you'd fetch from a database
    // with proper image counts for each category
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const reqData = await request.json();
    const { name } = reqData;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Check if category with this name already exists
    const existingCategory = categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 });
    }

    // Add new category
    const newCategory = {
      id: nextId++,
      name,
      imageCount: 0,
    };
    categories.push(newCategory);

    return NextResponse.json({
      success: true,
      message: 'Category added successfully',
      category: newCategory
    });
  } catch (error: any) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const reqData = await request.json();
    const { id, name } = reqData;

    if (!id || !name) {
      return NextResponse.json({ error: 'Category ID and name are required' }, { status: 400 });
    }

    // Find category by ID
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category with this name already exists (different from current)
    const existingCategory = categories.find(cat =>
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== id
    );
    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 });
    }

    // Update category
    categories[categoryIndex].name = name;

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: categories[categoryIndex]
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const id = parseInt(categoryId);
    const categoryIndex = categories.findIndex(cat => cat.id === id);

    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Don't allow deletion of categories that have images
    if (categories[categoryIndex].imageCount && categories[categoryIndex].imageCount > 0) {
      return NextResponse.json({
        error: 'Cannot delete category that contains images'
      }, { status: 400 });
    }

    // Remove category
    categories.splice(categoryIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}