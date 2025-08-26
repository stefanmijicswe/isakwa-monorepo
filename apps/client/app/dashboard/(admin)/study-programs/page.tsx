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
  Loader2,
  GraduationCap,
  Users,
  Clock
} from "lucide-react";
import { getStudyPrograms, StudyProgram } from "@/lib/study-programs.service";
import { EditStudyProgramModal } from "./components/edit-study-program-modal";
import { DeleteStudyProgramModal } from "./components/delete-study-program-modal";
import { AddStudyProgramModal } from "./components/add-study-program-modal";

export default function AdminStudyProgramsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [filteredStudyPrograms, setFilteredStudyPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedStudyProgram, setSelectedStudyProgram] = useState<StudyProgram | null>(null);

  // Fetch study programs from API
  useEffect(() => {
    const fetchStudyPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getStudyPrograms({
          limit: 50, // Get more study programs
          search: searchTerm || undefined
        });
        
        setStudyPrograms(response.data || []);
        setFilteredStudyPrograms(response.data || []);
      } catch (err) {
        console.error('Error fetching study programs:', err);
        setError('Failed to load study programs. Please try again.');
        setStudyPrograms([]);
        setFilteredStudyPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyPrograms();
  }, []); // Only fetch on component mount

  // Filter study programs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudyPrograms(studyPrograms);
      return;
    }

    const filtered = studyPrograms.filter(program =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.directorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredStudyPrograms(filtered);
  }, [searchTerm, studyPrograms]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle edit button click
  const handleEditClick = (studyProgram: StudyProgram) => {
    setSelectedStudyProgram(studyProgram);
    setEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (studyProgram: StudyProgram) => {
    setSelectedStudyProgram(studyProgram);
    setDeleteModalOpen(true);
  };

  // Handle add study program button click
  const handleAddStudyProgramClick = () => {
    setAddModalOpen(true);
  };

  // Handle successful edit
  const handleEditSuccess = (updatedStudyProgram: StudyProgram) => {
    setStudyPrograms(prev => prev.map(program => 
      program.id === updatedStudyProgram.id ? updatedStudyProgram : program
    ));
    setFilteredStudyPrograms(prev => prev.map(program => 
      program.id === updatedStudyProgram.id ? updatedStudyProgram : program
    ));
  };

  // Handle successful delete
  const handleDeleteSuccess = () => {
    if (selectedStudyProgram) {
      setStudyPrograms(prev => prev.filter(program => program.id !== selectedStudyProgram.id));
      setFilteredStudyPrograms(prev => prev.filter(program => program.id !== selectedStudyProgram.id));
      setSelectedStudyProgram(null);
    }
  };

  // Handle successful add
  const handleAddSuccess = (newStudyProgram: StudyProgram) => {
    setStudyPrograms(prev => [newStudyProgram, ...prev]);
    setFilteredStudyPrograms(prev => [newStudyProgram, ...prev]);
  };

  // Close modals
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedStudyProgram(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedStudyProgram(null);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Study Programs</h1>
          <Button size="sm" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Study Program
          </Button>
        </div>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search study programs..."
            disabled
            className="pl-10 h-9 text-sm"
          />
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            <span className="text-gray-500">Loading study programs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Study Programs</h1>
          <Button size="sm" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Study Program
          </Button>
        </div>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search study programs..."
            disabled
            className="pl-10 h-9 text-sm"
          />
        </div>

        <div className="text-center py-12">
          <BookOpen className="h-10 w-10 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading study programs</h3>
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
        <h1 className="text-xl font-medium text-gray-900">Study Programs</h1>
        <Button size="sm" onClick={handleAddStudyProgramClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Study Program
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search study programs..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 h-9 text-sm"
        />
      </div>

      {/* Study Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudyPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-medium mb-2 truncate leading-tight">
                    {program.name}
                  </CardTitle>
                  {program.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {program.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {program.duration} years
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 px-5 pb-4">
              <div className="space-y-2 text-sm">
                {program.directorName && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Director:</span>
                    <span className="font-medium">{program.directorName}</span>
                    {program.directorTitle && (
                      <span className="text-gray-400">({program.directorTitle})</span>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-semibold text-blue-600">{program.duration} years</span>
                </div>

                {program.faculty && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Faculty:</span>
                    <span className="font-medium">{program.faculty.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t">
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => handleEditClick(program)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-gray-400 hover:text-red-600"
                  onClick={() => handleDeleteClick(program)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudyPrograms.length === 0 && !loading && (
        <div className="text-center py-10">
          <GraduationCap className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {searchTerm ? 'No study programs found' : 'No study programs available'}
          </h3>
          <p className="text-xs text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'There are no study programs in the system yet'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <EditStudyProgramModal
        studyProgram={selectedStudyProgram}
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Modal */}
      <DeleteStudyProgramModal
        studyProgram={selectedStudyProgram}
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
      />

      {/* Add Study Program Modal */}
      <AddStudyProgramModal
        isOpen={addModalOpen}
        onClose={closeAddModal}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
