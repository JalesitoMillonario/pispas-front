
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function PageHeader({ title, description, searchTerm, onSearchChange }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold text-blue-900">{title}</h1>
        <p className="text-blue-600 font-medium">{description}</p>
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
        <Input
          placeholder="Buscar incidencia..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 border-blue-200 focus:border-blue-500"
        />
      </div>
    </motion.div>
  );
}
