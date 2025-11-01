import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProject } from '../../features/project/projectSlice';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ onSelectProject }) => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.project);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const filteredProjects = currentWorkspace
    ? projects.filter((project) => project.workspaceId === currentWorkspace.id)
    : projects;

  if (!filteredProjects.length) {
    return (
      <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
        No projects found. Create a project to get started.
      </div>
    );
  }

  const handleSelectProject = (project) => {
    dispatch(setCurrentProject(project));
    onSelectProject?.(project);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => handleSelectProject(project)}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
