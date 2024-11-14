"use client";

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FaPlus, FaImage, FaTrash, FaTextHeight, FaGripHorizontal, FaReply } from 'react-icons/fa';

// Define the components with unique styles and icons
const Content = () => (
  <div className="rounded border bg-gray-100 p-4 shadow-inner">
    <textarea
      placeholder="Enter text here"
      className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const TextInput = () => (
  <div className="rounded border bg-gray-100 p-4 shadow-inner">
    <input
      type="text"
      placeholder="Enter text"
      className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const ButtonComponent = () => (
  <div className="rounded border bg-gray-100 p-4 shadow-inner">
    <button className="w-full rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600">
      Click Me
    </button>
  </div>
);

const ImageInput = () => (
  <div className="rounded border bg-gray-100 p-4 shadow-inner">
    <input
      type="file"
      accept="image/*"
      className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const CarouselComponent = () => (
  <div className="rounded border bg-gray-100 p-4 shadow-inner">
    <div className="flex justify-center">Carousel Placeholder</div>
  </div>
);

const GalleryComponent = () => (
  <div className="rounded border bg-gray-100 p-4 shadow-inner">
    <div className="flex justify-center">Gallery Placeholder</div>
  </div>
);

const QuickReplyComponent = () => (
  <div className="rounded border bg-gray-100 p-4 shadow-inner">
    <button className="w-full rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600">
      Quick Reply
    </button>
  </div>
);

const componentOptions = [
  { name: 'Textarea', component: Content, icon: <FaTextHeight /> },
  { name: 'Text Input', component: TextInput, icon: <FaTextHeight /> },
  { name: 'Button', component: ButtonComponent, icon: <FaPlus /> },
  { name: 'Image Input', component: ImageInput, icon: <FaImage /> },
  { name: 'Carousel', component: CarouselComponent, icon: <FaGripHorizontal /> },
  { name: 'Gallery', component: GalleryComponent, icon: <FaGripHorizontal /> },
  { name: 'Quick Reply', component: QuickReplyComponent, icon: <FaReply /> },
];

// Node component for displaying selected components with headers
const TextUpdaterNode = ({ data, selected }) => (
  <div
    className={`rounded-lg border border-gray-300 bg-white p-2 shadow-lg dark:bg-gray-800 ${
      selected ? 'ring-2 ring-blue-500' : ''
    }`}
  >
    <Handle
      type="target"
      position="top"
      style={{
        background: '#555',
        borderRadius: '50%',
        border: '2px solid #333',
        width: 15,
        height: 15,
      }}
    />
    <Handle
      type="source"
      position="bottom"
      style={{
        background: '#007bff',
        borderRadius: '50%',
        border: '2px solid #0056b3',
        width: 15,
        height: 15,
      }}
    />

    <div className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-300">
      {data.header}
    </div>

    {data.components.length === 0 ? (
      <p className="text-sm text-gray-500 dark:text-gray-400">Add a component</p>
    ) : (
      data.components.map((Component, index) => (
        <div key={index} className="mt-2">
          <Component />
        </div>
      ))
    )}
  </div>
);

const NodeComponent = ({ data, onDelete, onDrop, selected }) => {
  const handleDropdownChange = (e) => {
    const selectedComponent = componentOptions.find(
      (option) => option.name === e.target.value
    )?.component;
    if (selectedComponent) onDrop(selectedComponent);
  };

  return (
    <div
      className={`relative rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-lg dark:bg-gray-700 ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <TextUpdaterNode data={data} selected={selected} />
      
      <select
        onChange={handleDropdownChange}
        className="mt-2 w-full rounded border bg-white p-2 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
      >
        <option value="">Add Component</option>
        {componentOptions.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>

      <button
        onClick={onDelete}
        className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
        title="Delete Node"
      >
        <FaTrash size={10} />
      </button>
    </div>
  );
};

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [theme, setTheme] = useState('light');

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { components: [], header: 'New Node' },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const handleDrop = (component, nodeId) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, components: [...node.data.components, component], header: node.data.header || 'Node' } };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const nodeTypes = {
    custom: (props) => (
      <NodeComponent
        {...props}
        onDelete={() => deleteNode(props.id)}
        onDrop={(component) => handleDrop(component, props.id)}
        selected={selectedNode === props.id}
      />
    ),
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node.id);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-900">
        <div className="w-44 overflow-y-auto bg-white p-4 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Component</h2>
            <button onClick={toggleTheme} className="rounded-full bg-gray-300 p-2 dark:bg-gray-600">
              {theme === 'light' ? '🌙' : '🌞'}
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={addNode}
              className="flex items-center rounded bg-blue-500 px-4 py-2 text-white shadow transition-colors hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add Node
            </button>
          </div>
        </div>
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
          >
            <MiniMap />
            <Controls />
            <Background variant={BackgroundVariant.Lines} gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default Flow;
