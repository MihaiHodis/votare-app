CREATE DATABASE IF NOT EXISTS votare;
USE votare;

CREATE TABLE IF NOT EXISTS optiuni (
  nume VARCHAR(255) PRIMARY KEY,
  voturi INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS votanti (
  cnp VARCHAR(13) PRIMARY KEY,
  optiune_votata VARCHAR(255),
  FOREIGN KEY (optiune_votata) REFERENCES optiuni(nume)
);

-- New table for option images
CREATE TABLE IF NOT EXISTS option_paths (
  option_name VARCHAR(255) PRIMARY KEY,
  image_path VARCHAR(255),
  FOREIGN KEY (option_name) REFERENCES optiuni(nume) ON DELETE CASCADE
);
