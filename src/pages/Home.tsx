import React from 'react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-section"
      >
        <h1>Bem-vindo ao meu Portfolio</h1>
        <p>Desenvolvedor Full Stack apaixonado por criar soluções inovadoras</p>
      </motion.div>
    </div>
  );
};

export default Home;
