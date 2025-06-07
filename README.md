# API Server

Uma API RESTful robusta construída com Node.js e TypeScript, seguindo princípios de Clean Architecture, Domain-Driven Design (DDD) e SOLID, com containerização Docker para desenvolvimento e produção.

## 📋 Sumário

- [🚀 Tecnologias](#-tecnologias)
- [🏗️ Arquitetura e Padrões](#️-arquitetura-e-padrões)
- [🔧 Providers (Provedores)](#-providers-provedores)
- [🐳 Docker e Containerização](#-docker-e-containerização)
- [🚀 Inicialização do Projeto](#-inicialização-do-projeto)
- [📋 Comandos Úteis](#-comandos-úteis)
- [🔧 Configuração](#-configuração)
- [📚 Documentação da API (Swagger)](#-documentação-da-api-swagger)
- [🗑️ Gerenciamento de Dados (Soft Delete)](#️-gerenciamento-de-dados-soft-delete)
- [🛡️ Segurança](#️-segurança)
- [🧪 Testes](#-testes)
- [📝 Contribuição](#-contribuição)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript/JavaScript
- **Docker & Docker Compose** - Containerização
- **TSyringe** - Container de injeção de dependência
- **Swagger/OpenAPI** - Documentação da API
- **Jest** - Framework de testes
- **Prettier** - Formatação automática de código
- **Celebrate** - Validação de dados baseada em Joi
- **Multer** - Upload de arquivos multipart/form-data
- **Cloudinary** - Serviço de armazenamento e manipulação de imagens
- **Brevo (ex-SendinBlue)** - Serviço de envio de emails SMTP

## 🏗️ Arquitetura e Padrões

### Clean Architecture + DDD (Domain-Driven Design)

O projeto segue os princípios da Clean Architecture combinada com Domain-Driven Design, organizando o código em domínios e camadas bem definidas:

```
src/
├── modules/           # Bounded Contexts (Domínios)
│   ├── users/        # Domínio de usuários
│   │   ├── dtos/     # Data Transfer Objects
│   │   ├── entities/ # Entidades de domínio
│   │   ├── services/ # Casos de uso/Serviços de aplicação
│   │   ├── infra/    # Infraestrutura (HTTP, TypeORM)
│   │   └── providers/# Provedores específicos do domínio
│   ├── posts/        # Domínio de posts
│   ├── comments/     # Domínio de comentários
│   ├── likes/        # Domínio de curtidas
│   ├── follows/      # Domínio de seguidores
│   └── files/        # Domínio de arquivos
├── shared/           # Recursos compartilhados
│   ├── container/    # Container de DI
│   ├── providers/    # Provedores globais
│   ├── infra/        # Infraestrutura compartilhada
│   └── errors/       # Tratamento de erros
```

### Domain-Driven Design (DDD)

#### Bounded Contexts

Cada módulo representa um contexto delimitado com:

- **Entidades** - Objetos com identidade única
- **Casos de Uso** - Regras de negócio específicas
- **Repositórios** - Abstração de persistência
- **DTOs** - Contratos de entrada e saída

#### Linguagem Ubíqua

Termos de negócio refletidos no código:

- `Users` (Usuários)
- `Posts` (Publicações)
- `Follows` (Relacionamentos de seguir)
- `Likes` (Curtidas)
- `Comments` (Comentários)

### Soft Delete Pattern

O sistema implementa **Soft Delete** em todas as entidades principais, garantindo integridade referencial e auditoria:

#### Implementação

```typescript
// Entidade com soft delete
@Entity('users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ default: true })
  active: boolean; // Campo para soft delete

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### Vantagens do Soft Delete:

- **Auditoria** - Histórico completo de dados
- **Integridade Referencial** - Relacionamentos preservados
- **Recuperação** - Possibilidade de restaurar dados
- **Compliance** - Atendimento a regulamentações (LGPD, GDPR)

#### Comportamento por Entidade:

**Users (Usuários)**

```typescript
// Ao desativar usuário, desativa também:
- Tokens de autenticação (user_tokens.active = false)
- Avatar (files.active = false, user_id = null)
- Posts relacionados (cascade)
- Comentários relacionados (cascade)
```

**Posts (Publicações)**

```typescript
// Ao desativar post, desativa também:
- Arquivos associados (files.active = false, post_id = null)
- Comentários do post (cascade)
- Likes do post (cascade)
```

**Files (Arquivos)**

```typescript
// Ao desativar arquivo:
- Remove associações (post_id = null, user_id = null)
- Mantém arquivo físico para auditoria
```

**Comments (Comentários)**

```typescript
// Soft delete simples com verificação de permissões
- Mantém histórico de comentários
- Preserva estrutura de threads
```

#### Queries com Soft Delete:

```typescript
// Repository sempre filtra por active = true
public async find(search: ISearchUsersDTO): Promise<Users[]> {
  const query = this.ormRepository
    .createQueryBuilder('users')
    .where('users.active = :active', { active: true });

  return query.getMany();
}

// Para incluir inativos (admin/auditoria)
public async findWithInactive(): Promise<Users[]> {
  return this.ormRepository.find(); // Sem filtro de active
}
```

### Padrões Implementados

#### 1. **Dependency Injection**

Utiliza TSyringe para inversão de controle e injeção de dependências:

```typescript
@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
}
```

#### 2. **Repository Pattern**

Abstração da camada de dados com interfaces bem definidas:

```typescript
interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<Users>;
  findById(id: string): Promise<Users | null>;
  save(user: Users): Promise<Users>;
  find(search: ISearchUsersDTO): Promise<Users[]>;
}
```

#### 3. **Provider Pattern**

Abstrações para serviços externos e utilitários:

```typescript
// Providers de Hash
interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}

// Providers de Email
interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}

// Providers de Storage
interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
```

#### 4. **Service Layer**

Lógica de negócio encapsulada em serviços especializados:

- `CreateUserService` - Criação de usuários
- `UpdateUserService` - Atualização de usuários (incluindo soft delete)
- `ResetPasswordService` - Reset de senhas
- `ShowPostsService` - Listagem de posts
- `DeleteLikeService` - Remoção de curtidas

#### 5. **DTO (Data Transfer Objects)**

Contratos bem definidos para transferência de dados:

- `ICreateUserDTO` - Dados para criação de usuário
- `IUpdateCommentDTO` - Dados para atualização de comentário (incluindo active)
- `IResetPasswordDTO` - Dados para reset de senha

## 🔧 Providers (Provedores)

### Hash Provider

Responsável pela criptografia de senhas:

```typescript
@injectable()
class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string>;
  public async compareHash(payload: string, hashed: string): Promise<boolean>;
}
```

### Mail Provider (Brevo)

Gerenciamento de envio de emails via Brevo (ex-SendinBlue):

```typescript
@injectable()
class BrevoMailProvider implements IMailProvider {
  public async sendMail(data: ISendMailDTO): Promise<void>;
}
```

### Storage Provider (Cloudinary)

Gerenciamento de arquivos via Cloudinary:

```typescript
@injectable()
class CloudinaryStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string>;
  public async deleteFile(file: string): Promise<void>;
}
```

### Logger Provider

Sistema de logs estruturado para monitoramento:

```typescript
@injectable()
class LoggerProvider implements ILoggerProvider {
  public info(message: string): void;
  public error(message: string): void;
  public warn(message: string): void;
  public debug(message: string): void;
}
```

## 🐳 Docker e Containerização

### Estrutura de Containers

- **server** - Aplicação Node.js
- **db** - PostgreSQL database
- **pgadmin** - Interface web para PostgreSQL

### Configuração de Portas

O sistema utiliza variáveis de ambiente para configuração flexível de portas:

```env
# Porta externa (host) - onde você acessa a aplicação
PORT=8083

# Porta interna (container) - porta do Express dentro do container
INTERNAL_PORT=3333
```

**Fluxo de Portas:**

1. **docker-compose.yml** - Mapeia `${PORT}:${INTERNAL_PORT}` (8083:3333)
2. **server.ts** - Express escuta na `INTERNAL_PORT` (3333) dentro do container
3. **Acesso** - Aplicação disponível em `http://localhost:8083`

### Scripts de Banco de Dados

#### Backup

```bash
# Gera backup automático com timestamp
postgres/scripts/backup.bat
```

#### Restore

```bash
# Restaura backup específico
postgres/scripts/restore.bat
```

#### Drop All Tables

```bash
# Remove todas as tabelas (desenvolvimento)
postgres/scripts/dropall.bat
```

## 🚀 Inicialização do Projeto

### 1. Subir os containers

```bash
docker compose up -d
```

### 2. Acessar o container da aplicação

```bash
docker compose exec server bash
```

### 3. Instalar dependências (se necessário)

```bash
yarn
```

### 4. Sincronizar estrutura do banco

```bash
yarn typeorm:sync
```

### 5. Iniciar o servidor de desenvolvimento

```bash
yarn dev
```

## 📋 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento
yarn dev

# Executar testes
yarn test

# Build para produção
yarn build

# Iniciar produção
yarn start

# Verificação de erros com Prettier
yarn lint

# Formatação de código
yarn format
```

### TypeORM

```bash
# Sincronizar estrutura do banco (desenvolvimento)
yarn typeorm:sync
```

### Docker

```bash
# Subir containers
docker compose up -d

# Parar e remover containers
docker compose down

# Parar containers
docker compose stop

# Acessar container
docker compose exec server bash
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Database PostgreSQL
TYPEORM_HOST=db
TYPEORM_PORT=5432
TYPEORM_USER=arthur
TYPEORM_PASSWORD=3301
TYPEORM_DB=pg
TYPEORM_LOGGING=true
TYPEORM_SYNCHRONIZE=false

# Docker PostgreSQL
POSTGRES_USER=arthur
POSTGRES_PASSWORD=3301
POSTGRES_DB=pg

# PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin123

# Application Ports
PORT=8083              # Porta externa (host)
INTERNAL_PORT=3333     # Porta interna (container)

# JWT Authentication
APP_SECRET=your_jwt_secret_here

# Brevo SMTP (Email Service)
BREVO_USER=your_brevo_user
BREVO_PASS=your_brevo_password

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Configuração de Portas Detalhada

O sistema permite configuração flexível de portas através das variáveis:

- **PORT**: Porta onde você acessa a aplicação no seu navegador/cliente
- **INTERNAL_PORT**: Porta interna do container onde o Express está rodando

**Exemplo de configuração:**

```env
PORT=8083           # Acesso: http://localhost:8083
INTERNAL_PORT=3333  # Express roda na porta 3333 dentro do container
```

## 📚 Documentação da API (Swagger)

A documentação completa da API está disponível através do Swagger UI quando é iniciado o código:

**🔗 [http://localhost:8083/api-docs](http://localhost:8083/api-docs)**

A documentação inclui:

- Todos os endpoints disponíveis
- Parâmetros de entrada e saída
- Códigos de resposta HTTP
- Exemplos de requisições
- Modelos de dados (schemas)
- Autenticação e autorização

### Recursos da Documentação:

- **Try it out** - Teste os endpoints diretamente
- **Schemas** - Visualize os modelos de dados
- **Authentication** - Configure tokens JWT
- **Examples** - Veja exemplos de requisições/respostas

## 🗑️ Gerenciamento de Dados (Soft Delete)

### Filosofia do Soft Delete

O sistema adota uma abordagem de **preservação de dados** onde:

1. **Nunca perdemos dados críticos** - Usuários, posts, comentários são preservados
2. **Integridade referencial** - Relacionamentos são mantidos para auditoria
3. **Compliance** - Atendimento a LGPD/GDPR com possibilidade de "esquecimento"
4. **Recuperação** - Dados podem ser restaurados se necessário

## 🛡️ Segurança

- **Autenticação JWT** - Tokens seguros para autenticação
- **Validação de dados** - Celebrate/Joi para validação
