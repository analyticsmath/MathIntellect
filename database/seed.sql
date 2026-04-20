-- Math Intel Dashboard - Seed Data
-- Demo data for development and testing

-- Insert demo users (passwords are bcrypt hashed: 'password123')
INSERT INTO users (id, email, username, password, role) VALUES
  (uuid_generate_v4(), 'admin@mathintel.dev', 'admin', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu', 'admin'),
  (uuid_generate_v4(), 'demo@mathintel.dev',  'demo',  '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu', 'user')
ON CONFLICT DO NOTHING;

-- Insert demo simulations
INSERT INTO simulations (user_id, name, description, type, status, config)
SELECT
  u.id,
  'Monte Carlo Price Simulation',
  'Simulate asset price paths using Geometric Brownian Motion',
  'monte_carlo',
  'completed',
  '{"iterations": 10000, "time_horizon": 252, "initial_price": 100, "volatility": 0.2, "drift": 0.05}'::jsonb
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO simulations (user_id, name, description, type, status, config)
SELECT
  u.id,
  'Linear Regression Trend Analysis',
  'Fit a linear model to historical data and forecast future values',
  'linear_regression',
  'completed',
  '{"features": ["time", "volume"], "target": "price", "train_split": 0.8}'::jsonb
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

-- Insert demo strategies
INSERT INTO strategies (user_id, name, description, algorithm, parameters)
SELECT
  u.id,
  'Mean Reversion Strategy',
  'Buy when price deviates below mean, sell when above',
  'mean_reversion',
  '{"window": 20, "threshold": 2.0, "position_size": 0.1}'::jsonb
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;
