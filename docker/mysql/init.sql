CREATE DATABASE IF NOT EXISTS votare;
USE votare;

CREATE TABLE IF NOT EXISTS optiuni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nume VARCHAR(255) UNIQUE,
  voturi INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS votanti (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cnp VARCHAR(13) UNIQUE,
  optiune_votata VARCHAR(255),
  FOREIGN KEY (optiune_votata) REFERENCES optiuni(nume)
);

-- New table for option images
CREATE TABLE IF NOT EXISTS option_paths (
  id INT AUTO_INCREMENT PRIMARY KEY,
  option_name VARCHAR(255) UNIQUE,
  image_path VARCHAR(255),
  FOREIGN KEY (option_name) REFERENCES optiuni(nume) ON DELETE CASCADE
);
