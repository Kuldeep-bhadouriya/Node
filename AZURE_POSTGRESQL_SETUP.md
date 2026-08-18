# Azure PostgreSQL Flexible Server Setup Guide

## Prerequisites
- Azure for Students subscription (free  credit)
- Valid academic email address

## Step 1: Create Azure for Students Account
1. Go to https://azure.microsoft.com/free/students
2. Sign in with your Microsoft account
3. Verify your student status with your academic email
4. No credit card required

## Step 2: Create PostgreSQL Flexible Server

1. Go to Azure Portal (https://portal.azure.com)
2. Click "Create a resource" > "Databases" > "Azure Database for PostgreSQL"
3. Select "Flexible Server" deployment option
4. Configure basics:
   - Server name: Choose a unique name (e.g., college-qr-db)
   - Region: Choose closest to you (e.g., Southeast Asia, East Asia)
   - PostgreSQL version: 15 or 16 (recommended)
   - Workload type: Development (for free tier)
   - Compute tier: Burstable
   - Compute size: B1ms (free tier eligible)
   - Storage: 32 GB (minimum)
   - Backup retention: 7 days

5. Set admin credentials:
   - Admin username: postgres (or your preferred username)
   - Password: Create a strong password (save this!)

6. Networking:
   - Select "Public access"
   - Add your current IP address
   - OR allow all Azure services (for development)

7. Review and create

## Step 3: Get Connection String

1. In your server overview, click "Connection strings"
2. Copy the connection string format
3. Parse it to extract:
   - Host: your-server.postgres.database.azure.com
   - Port: 5432
   - Database: postgres (default)
   - Username: Your admin username
   - Password: Your admin password

## Step 4: Update .env File

Update apps/web/.env with your Azure PostgreSQL credentials:

``nv
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@YOUR_SERVER_NAME.postgres.database.azure.com:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@YOUR_SERVER_NAME.postgres.database.azure.com:5432/postgres?sslmode=require"
``

Replace:
- YOUR_USERNAME - Admin username you set (e.g., postgres)
- YOUR_PASSWORD - Your admin password (URL encode special characters)
- YOUR_SERVER_NAME - Your server name from step 2

Note: URL encode special characters in password:
- `@` becomes `%40`
- `#` becomes `%23`
- `:` becomes `%3A`

## Step 5: Run Migrations

``ash
cd packages/db
npx prisma migrate deploy
# or for development
npx prisma db push
``

## Firewall Rules

If you get connection errors:

1. Go to your server > "Security" > "Networking"
2. Add your current IP address
3. Or add Azure services IP range for cloud deployments

## Cost Optimization Tips

- Use B1ms burstable tier for development
- Enable auto-scaling for production
- Set up server to auto-stop during non-working hours (dev tier)
- Monitor usage in Azure Cost Management

## Troubleshooting

### Connection refused
- Check firewall rules allow your IP
- Verify SSL mode is enabled (sslmode=require)

### Authentication failed
- Verify username format: username@server-name
- Check password encoding for special characters

### Database doesn't exist
- Connect with postgres database first
- Create your database using Azure CLI or portal
