import React from 'react';
import { motion } from 'framer-motion';

const Projects: React.FC = () => {
  return (
    <div className="projects-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="projects-content"
      >
        <h1>Meus Projetos</h1>
        <p>Confira alguns dos projetos que desenvolvi</p>
      </motion.div>
    </div>
  );
};

export default Projects;
