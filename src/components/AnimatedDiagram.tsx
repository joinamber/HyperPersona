
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NodeProps {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

interface EdgeProps {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  dashed?: boolean;
}

interface AnimatedDiagramProps {
  nodes: NodeProps[];
  edges: EdgeProps[];
  className?: string;
}

const AnimatedDiagram: React.FC<AnimatedDiagramProps> = ({ nodes, edges, className }) => {
  const [visibleNodes, setVisibleNodes] = useState<string[]>([]);
  const [visibleEdges, setVisibleEdges] = useState<EdgeProps[]>([]);
  
  useEffect(() => {
    // Animate nodes entry
    const nodeIds = nodes.map(node => node.id);
    let currentNodes: string[] = [];
    
    const nodeInterval = setInterval(() => {
      if (currentNodes.length < nodeIds.length) {
        currentNodes.push(nodeIds[currentNodes.length]);
        setVisibleNodes([...currentNodes]);
      } else {
        clearInterval(nodeInterval);
        
        // After all nodes are visible, animate edges
        let currentEdges: EdgeProps[] = [];
        
        const edgeInterval = setInterval(() => {
          if (currentEdges.length < edges.length) {
            currentEdges.push(edges[currentEdges.length]);
            setVisibleEdges([...currentEdges]);
          } else {
            clearInterval(edgeInterval);
          }
        }, 300);
      }
    }, 200);
    
    return () => {
      clearInterval(nodeInterval);
    };
  }, [nodes, edges]);
  
  // Helper to find node by id
  const getNode = (id: string) => nodes.find(node => node.id === id);
  
  return (
    <div className={cn("relative h-[400px] w-full", className)}>
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Render edges */}
        {visibleEdges.map((edge, index) => {
          const fromNode = getNode(edge.from);
          const toNode = getNode(edge.to);
          
          if (!fromNode || !toNode) return null;
          
          const x1 = fromNode.x;
          const y1 = fromNode.y;
          const x2 = toNode.x;
          const y2 = toNode.y;
          
          return (
            <g key={`${edge.from}-${edge.to}-${index}`}>
              {edge.animated ? (
                <>
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x1}
                    y2={y1}
                    animate={{ x2, y2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    stroke="#888"
                    strokeWidth="2"
                    strokeDasharray={edge.dashed ? "5,5" : "0"}
                  />
                </>
              ) : (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#888"
                  strokeWidth="2"
                  strokeDasharray={edge.dashed ? "5,5" : "0"}
                />
              )}
              
              {edge.label && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 10}
                  textAnchor="middle"
                  fill="#888"
                  fontSize="12"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Render nodes */}
        {nodes.map((node) => (
          visibleNodes.includes(node.id) && (
            <motion.g 
              key={node.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="30"
                fill={node.color || "#4f46e5"}
                opacity="0.8"
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {node.label}
              </text>
            </motion.g>
          )
        ))}
      </svg>
    </div>
  );
};

export default AnimatedDiagram;
