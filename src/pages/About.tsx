import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="about-content"
      >
        <h1>Sobre Mim</h1>
        <p>Desenvolvedor Full Stack com experiência em tecnologias modernas</p>
      </motion.div>
    </div>
  );
};

export default About;
