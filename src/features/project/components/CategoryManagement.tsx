'use client'
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    duration: number;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'Development', duration: 14 },
        { id: '2', name: 'Design', duration: 7 },
        { id: '3', name: 'Testing', duration: 5 },
    ]);

    const [newCategory, setNewCategory] = useState({ name: '', duration: 1 });
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const handleAddCategory = () => {
        if (newCategory.name.trim()) {
            const newCat = {
                id: Date.now().toString(),
                name: newCategory.name.trim(),
                duration: newCategory.duration || 1
            };

            setCategories([...categories, newCat]);
            setNewCategory({ name: '', duration: 1 });
            setIsAddingCategory(false);
        }
    };

    const handleRemoveCategory = (id: string) => {
        setCategories(categories.filter(cat => cat.id !== id));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Categories</h3>

                {!isAddingCategory && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingCategory(true)}
                        className="flex items-center gap-1.5 text-gray-700 border-gray-200"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Category</span>
                    </Button>
                )}
            </div>

            {/* Category List */}
            <div className="space-y-3 mb-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100"
                    >
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{category.name}</h4>
                            <p className="text-sm text-gray-500">{category.duration} {category.duration === 1 ? 'day' : 'days'}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCategory(category.id)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="text-center p-6 text-gray-500">
                        No categories found. Add your first category.
                    </div>
                )}
            </div>

            {/* Add Category Form */}
            {isAddingCategory && (
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-800 mb-3">Add New Category</h4>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name
                            </label>
                            <Input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                placeholder="Enter category name"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (days)
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={newCategory.duration}
                                onChange={(e) => setNewCategory({...newCategory, duration: parseInt(e.target.value) || 1})}
                                placeholder="Enter duration in days"
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddingCategory(false)}
                                className="text-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleAddCategory}
                                className="bg-gray-900 text-white hover:bg-gray-800"
                                disabled={!newCategory.name.trim()}
                            >
                                Add Category
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;