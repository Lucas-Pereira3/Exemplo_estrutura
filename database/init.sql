CREATE TABLE empresa (
	id_empresa SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	cnpj VARCHAR(20) NOT NULL UNIQUE,
	email VARCHAR(100) UNIQUE NOT NULL,
	endereco TEXT,
	telefone VARCHAR(20)
);

CREATE TABLE usuario(
	id_usuario SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	login VARCHAR(100) UNIQUE NOT NULL,
	senha_hash VARCHAR(250) NOT NULL
);

CREATE TABLE cliente (
	id_cliente SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
	telefone VARCHAR(20),
	email VARCHAR(100),
	endereco TEXT,
	limite DECIMAL(10,2),
	id_empresa INT,
	FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE fatura(
	id_fatura SERIAL PRIMARY KEY,
	data_geracao DATE,
	valor_total DECIMAL(10,2),
	status VARCHAR(20),
	id_cliente INT,
	FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE compra (
	id_compra SERIAL PRIMARY KEY,
	data_compra DATE,
	valor_total DECIMAL(10,2),
	data_venciomento DATE,
	parcelas INT,
	id_cliente INT,
	id_fatura INT,
	FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
	FOREIGN KEY (id_fatura) REFERENCES fatura(id_fatura)
);

CREATE TABLE pagamento (
	id_pagamento SERIAL PRIMARY KEY,
	data_pagamento DATE,
	valor_pago DECIMAL(10,2),
	id_fatura INT,
	FOREIGN KEY (id_fatura) REFERENCES fatura(id_fatura)
);