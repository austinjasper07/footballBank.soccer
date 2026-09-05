# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier available)

### Step 2: Get Connection String
1. In your Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `footballbank`

### Step 3: Set Environment Variable
Create a `.env.local` file in your project root:
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/footballbank?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### For Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

### For macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### For Linux (Ubuntu/Debian):
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Option 3: Docker (Alternative)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Testing Connection

After setup, test your connection:
```bash
# For local MongoDB
mongosh mongodb://localhost:27017/footballbank

# For Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/footballbank"
```

## Environment Variables

Make sure your `.env.local` file contains:
```
DATABASE_URL=mongodb://localhost:27017/footballbank
# OR for Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/footballbank?retryWrites=true&w=majority
```

## Troubleshooting

### Common Issues:
1. **Connection timeout**: Check if MongoDB is running
2. **Authentication failed**: Verify username/password
3. **Network issues**: Check firewall settings
4. **Atlas connection**: Ensure IP is whitelisted

### Quick Test:
Visit `http://localhost:3000/api/health` to test database connection.
