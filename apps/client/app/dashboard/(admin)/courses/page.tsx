"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import { getSubjects, Subject } from "@/lib/subjects.service";
import { EditSubjectModal } from "./components/edit-subject-modal";
import { DeleteSubjectModal } from "./components/delete-subject-modal";
import { AddSubjectModal } from "./components/add-subject-modal";

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getSubjects({
          limit: 50, // Get more subjects
          search: searchTerm || undefined
        });
        
        setSubjects(response.data || []);
        setFilteredSubjects(response.data || []);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects. Please try again.');
        setSubjects([]);
        setFilteredSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []); // Only fetch on component mount

  // Filter subjects based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubjects(subjects);
      return;
    }

    const filtered = subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredSubjects(filtered);
  }, [searchTerm, subjects]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle edit button click
  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setDeleteModalOpen(true);
  };

  // Handle add course button click
  const handleAddCourseClick = () => {
    setAddModalOpen(true);
  };

  // Handle successful edit
  const handleEditSuccess = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === updatedSubject.id ? updatedSubject : subject
    ));
    setFilteredSubjects(prev => prev.map(subject => 
      subject.id === updatedSubject.id ? updatedSubject : subject
    ));
  };

  // Handle successful delete
  const handleDeleteSuccess = () => {
    if (selectedSubject) {
      setSubjects(prev => prev.filter(subject => subject.id !== selectedSubject.id));
      setFilteredSubjects(prev => prev.filter(subject => subject.id !== selectedSubject.id));
      setSelectedSubject(null);
    }
  };

  // Handle successful add
  const handleAddSuccess = (newSubject: Subject) => {
    setSubjects(prev => [newSubject, ...prev]);
    setFilteredSubjects(prev => [newSubject, ...prev]);
  };

  // Close modals
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedSubject(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedSubject(null);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Courses</h1>
          <Button size="sm" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            disabled
            className="pl-10 h-9 text-sm"
          />
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            <span className="text-gray-500">Loading courses...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Courses</h1>
          <Button size="sm" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            disabled
            className="pl-10 h-9 text-sm"
          />
        </div>

        <div className="text-center py-12">
          <BookOpen className="h-10 w-10 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading courses</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">Courses</h1>
        <Button size="sm" onClick={handleAddCourseClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 h-9 text-sm"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-medium mb-2 truncate leading-tight">
                    {subject.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 font-mono">
                    {subject.code}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {subject.semester}. semester
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 px-5 pb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">ECTS</span>
                  <span className="font-semibold text-blue-600">{subject.credits}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Hours</span>
                  <span className="font-medium">
                    {subject.lectureHours}L + {subject.exerciseHours}E
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t">
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => handleEditClick(subject)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-gray-400 hover:text-red-600"
                  onClick={() => handleDeleteClick(subject)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && !loading && (
        <div className="text-center py-10">
          <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {searchTerm ? 'No courses found' : 'No courses available'}
          </h3>
          <p className="text-xs text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'There are no courses in the system yet'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <EditSubjectModal
        subject={selectedSubject}
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Modal */}
      <DeleteSubjectModal
        subject={selectedSubject}
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
      />

      {/* Add Course Modal */}
      <AddSubjectModal
        isOpen={addModalOpen}
        onClose={closeAddModal}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
