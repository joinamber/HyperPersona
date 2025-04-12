
import React from 'react';
import { motion } from 'framer-motion';
import CodeBlock from './CodeBlock';
import AnimatedDiagram from './AnimatedDiagram';
import FeatureCard from './FeatureCard';
import { architectureDiagramData, components } from '@/data/slideData';

interface SlideContentProps {
  title: string;
  content: React.ReactNode;
  contentType?: 'code' | 'diagram' | 'features' | 'title' | 'text';
}

const SlideContent: React.FC<SlideContentProps> = ({ 
  title, 
  content, 
  contentType = 'text'
}) => {
  const renderContent = () => {
    switch (contentType) {
      case 'code':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <CodeBlock code={content as string} />
          </motion.div>
        );
        
      case 'diagram':
        return <AnimatedDiagram nodes={architectureDiagramData.nodes} edges={architectureDiagramData.edges} />;
        
      case 'features':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto"
          >
            {components.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </motion.div>
        );
        
      case 'title':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
            <p className="text-xl md:text-2xl opacity-80">{content}</p>
          </motion.div>
        );
        
      case 'text':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-8 text-center">{title}</h2>
            {Array.isArray(content) ? (
              <ul className="space-y-4 text-lg md:text-xl">
                {content.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-lg md:text-xl">{content}</p>
            )}
          </motion.div>
        );
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto px-4 py-10">
      {contentType !== 'title' && (
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold mb-8 text-center"
        >
          {title}
        </motion.h2>
      )}
      {renderContent()}
    </div>
  );
};

export default SlideContent;
