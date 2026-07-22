import React, { useState } from 'react';
import { Database, Download, Code, CheckCircle2, Copy } from 'lucide-react';
import { ToastType } from '../../types';

interface AdminSqlExportProps {
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const AdminSqlExport: React.FC<AdminSqlExportProps> = ({ onShowToast }) => {
  const [copied, setCopied] = useState(false);

  const sqlSample = `-- MySQL Migration & Schema Script for Evan Akbar Portfolio
CREATE DATABASE IF NOT EXISTS \`evan_portfolio\` DEFAULT CHARACTER SET utf8mb4;
USE \`evan_portfolio\`;

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('Super Admin', 'Admin') DEFAULT 'Admin'
);

CREATE TABLE IF NOT EXISTS \`projects\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`short_desc\` TEXT,
  \`thumbnail\` VARCHAR(500),
  \`github_url\` VARCHAR(500),
  \`demo_url\` VARCHAR(500),
  \`status\` ENUM('Completed', 'Ongoing') DEFAULT 'Completed'
);

CREATE TABLE IF NOT EXISTS \`skills\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`category\` ENUM('Frontend', 'Backend', 'Database', 'Tools & Design') NOT NULL,
  \`percentage\` INT DEFAULT 80
);

CREATE TABLE IF NOT EXISTS \`certificates\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`issuer\` VARCHAR(150) NOT NULL,
  \`issue_date\` VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS \`contacts\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`subject\` VARCHAR(200),
  \`message\` TEXT,
  \`is_read\` BOOLEAN DEFAULT FALSE
);`;

  const handleDownload = () => {
    window.open('/api/schema/sql', '_blank');
    onShowToast('Download Diumpan', 'File schema.sql berhasil diunduh.', 'success');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    onShowToast('Disalin', 'Skrip SQL berhasil disalin ke clipboard.', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Database Schema & MySQL Export</h2>
          <p className="text-xs text-slate-400">Unduh skrip DDL/DML MySQL lengkap beserta tabel dan relasi data</p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download schema.sql</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Code className="w-4 h-4" />
            <span>SQL Migration Structure Preview</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Copy Script'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
          {sqlSample}
        </pre>
      </div>
    </div>
  );
};
