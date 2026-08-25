-- ============================================================
-- REGEN - FBG Time-Series Readings
-- Simulated sensor readings for all 20 FBG sensors
-- Covers approximately 30 days of readings (hourly = ~720 per sensor)
-- Filtered to key sensors for MVP (1000+ total readings)
-- ALL DATA IS SIMULATED - MVP DEMONSTRATION ONLY
-- ============================================================

-- ============================================================
-- Helper: Generate readings using a series approach
-- ============================================================
-- We use generate_series to create time-series data for each sensor.
-- Each sensor has a different behaviour pattern:
--   FBG-00021: Increasing trend (baseline 250, rising to 612)
--   FBG-00002: Increasing trend (baseline 220, rising to 489) - CRITICAL
--   FBG-00001: Stable elevated (baseline 180, current 267)
--   FBG-00007: Increasing trend (baseline 160, current 312)
--   FBG-00011: Increasing trend (baseline 140, current 198)
--   FBG-00016: Increasing trend (baseline 110, current 178)
--   FBG-00003: Offline (last 6 hours)
--   Others: Stable / slightly fluctuating
-- ============================================================

-- FBG-00021 (THE DEMO SENSOR — rapidly increasing, 30 days)
-- Readings every 30 minutes over 30 days = ~1440 readings for this sensor alone
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000021',
  t,
  GREATEST(240,
    LEAST(625,
      CASE
        -- Days 0-7: stable baseline with small noise
        WHEN t < NOW() - INTERVAL '23 days' THEN
          250 + (RANDOM() * 10 - 5)
        -- Days 7-14: very slight upward trend
        WHEN t < NOW() - INTERVAL '16 days' THEN
          250 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '30 days'))) / 86400) * 0.8) + (RANDOM() * 8 - 4)
        -- Days 14-21: accelerating increase
        WHEN t < NOW() - INTERVAL '9 days' THEN
          260 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '23 days'))) / 86400) * 5.5) + (RANDOM() * 12 - 6)
        -- Days 21-28: rapid increase
        WHEN t < NOW() - INTERVAL '2 days' THEN
          298 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '16 days'))) / 86400) * 25) + (RANDOM() * 15 - 7)
        -- Last 2 days: critical high with noise
        ELSE
          560 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '2 days'))) / 86400) * 26) + (RANDOM() * 20 - 10)
      END
    )
  ),
  1550.324 + (RANDOM() * 0.02 - 0.01),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '30 minutes'
) AS t;

-- FBG-00002 BRIDGE-009 (increasing to critical, 30 days)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000002',
  t,
  GREATEST(210,
    LEAST(500,
      CASE
        WHEN t < NOW() - INTERVAL '20 days' THEN
          220 + (RANDOM() * 8 - 4)
        WHEN t < NOW() - INTERVAL '10 days' THEN
          225 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '20 days'))) / 86400) * 8) + (RANDOM() * 10 - 5)
        ELSE
          305 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '10 days'))) / 86400) * 18.4) + (RANDOM() * 12 - 6)
      END
    )
  ),
  1549.876 + (RANDOM() * 0.02 - 0.01),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '45 minutes'
) AS t;

-- FBG-00001 BRIDGE-001 (stable elevated, 30 days)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000001',
  t,
  GREATEST(170,
    LEAST(285,
      CASE
        WHEN t < NOW() - INTERVAL '15 days' THEN
          185 + (RANDOM() * 12 - 6)
        ELSE
          240 + (RANDOM() * 14 - 7)
      END
    )
  ),
  1548.112 + (RANDOM() * 0.02 - 0.01),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00003 BRIDGE-018 (online then offline 6 hours ago)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000003',
  t,
  GREATEST(185,
    LEAST(210,
      195 + (RANDOM() * 10 - 5)
    )
  ),
  1551.005 + (RANDOM() * 0.02 - 0.01),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '6 hours',
  INTERVAL '1 hour'
) AS t;

-- FBG-00004 COMPOSITE-SLEEPER-002 (stable normal, 30 days)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000004',
  t,
  GREATEST(220,
    LEAST(250,
      233 + (RANDOM() * 10 - 5)
    )
  ),
  1549.234 + (RANDOM() * 0.015 - 0.0075),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00005 COMPOSITE-SLEEPER-006 (slightly elevated stable)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000005',
  t,
  GREATEST(238,
    LEAST(272,
      255 + (RANDOM() * 12 - 6)
    )
  ),
  1550.001 + (RANDOM() * 0.015 - 0.0075),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00006 COMPOSITE-SLEEPER-008 (very stable)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000006',
  t,
  GREATEST(232,
    LEAST(254,
      243 + (RANDOM() * 8 - 4)
    )
  ),
  1548.750 + (RANDOM() * 0.012 - 0.006),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00007 RETAINING-WALL-016 (increasing - coastal)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000007',
  t,
  GREATEST(150,
    LEAST(330,
      CASE
        WHEN t < NOW() - INTERVAL '20 days' THEN
          165 + (RANDOM() * 10 - 5)
        WHEN t < NOW() - INTERVAL '10 days' THEN
          175 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '20 days'))) / 86400) * 5.5) + (RANDOM() * 10 - 5)
        ELSE
          230 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '10 days'))) / 86400) * 8.2) + (RANDOM() * 12 - 6)
      END
    )
  ),
  1552.340 + (RANDOM() * 0.02 - 0.01),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00008 RETAINING-WALL-030 (was elevated, now slowly recovering)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000008',
  t,
  GREATEST(175,
    LEAST(250,
      CASE
        WHEN t < NOW() - INTERVAL '15 days' THEN
          230 + (RANDOM() * 10 - 5)
        WHEN t < NOW() - INTERVAL '5 days' THEN
          230 - ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '15 days'))) / 86400) * 3.5) + (RANDOM() * 8 - 4)
        ELSE
          195 + (RANDOM() * 8 - 4)
      END
    )
  ),
  1549.560 + (RANDOM() * 0.015 - 0.0075),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00009 COMPOSITE-SLEEPER-012 (stable, one transient spike 10 days ago)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000009',
  t,
  GREATEST(225,
    LEAST(420,
      CASE
        -- Transient spike 10 days ago
        WHEN ABS(EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '10 days 2 hours')))) < 1800 THEN
          380 + (RANDOM() * 40 - 20)
        ELSE
          237 + (RANDOM() * 8 - 4)
      END
    )
  ),
  1550.890 + (RANDOM() * 0.015 - 0.0075),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00010 COMPOSITE-SLEEPER-014 (very stable)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000010',
  t,
  GREATEST(240,
    LEAST(262,
      250 + (RANDOM() * 8 - 4)
    )
  ),
  1548.900 + (RANDOM() * 0.012 - 0.006),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00011 EMBANKMENT-001 (gradually increasing)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT
  '60000000-0000-0000-0000-000000000011',
  t,
  GREATEST(132,
    LEAST(210,
      CASE
        WHEN t < NOW() - INTERVAL '20 days' THEN
          145 + (RANDOM() * 10 - 5)
        ELSE
          145 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '20 days'))) / 86400) * 2.65) + (RANDOM() * 10 - 5)
      END
    )
  ),
  1553.110 + (RANDOM() * 0.02 - 0.01),
  TRUE
FROM generate_series(
  NOW() - INTERVAL '30 days',
  NOW(),
  INTERVAL '1 hour'
) AS t;

-- FBG-00012 through FBG-00020: Stable sensors (simplified, every 2 hours)
-- FBG-00012 COMPOSITE-SLEEPER-019
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000012', t,
  242 + (RANDOM() * 6 - 3), 1549.005 + (RANDOM() * 0.01 - 0.005), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;

-- FBG-00013 VIADUCT-024
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000013', t,
  327 + (RANDOM() * 14 - 7), 1547.789 + (RANDOM() * 0.015 - 0.0075), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;

-- FBG-00014 BRIDGE-023
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000014', t,
  285 + (RANDOM() * 10 - 5), 1550.445 + (RANDOM() * 0.012 - 0.006), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;

-- FBG-00015 BRIDGE-027
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000015', t,
  385 + (RANDOM() * 14 - 7), 1546.234 + (RANDOM() * 0.015 - 0.0075), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;

-- FBG-00016 EMBANKMENT-026 (gradual increase)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000016', t,
  GREATEST(105, LEAST(190,
    CASE
      WHEN t < NOW() - INTERVAL '20 days' THEN 115 + (RANDOM() * 8 - 4)
      ELSE 115 + ((EXTRACT(EPOCH FROM (t - (NOW() - INTERVAL '20 days'))) / 86400) * 3.15) + (RANDOM() * 10 - 5)
    END
  )),
  1554.001 + (RANDOM() * 0.02 - 0.01), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;

-- FBG-00017 COMPOSITE-SLEEPER-028
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000017', t,
  239 + (RANDOM() * 6 - 3), 1549.678 + (RANDOM() * 0.01 - 0.005), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;

-- FBG-00018 STEEL-RAIL-001 (calibrating - stable at exactly baseline)
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000018', t,
  210 + (RANDOM() * 2 - 1), 1550.000, TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW() - INTERVAL '15 minutes', INTERVAL '2 hours') AS t;

-- FBG-00019 SWITCH-ASSEMBLY-001
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000019', t,
  192 + (RANDOM() * 8 - 4), 1551.234 + (RANDOM() * 0.012 - 0.006), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;

-- FBG-00020 STEEL-RAIL-022
INSERT INTO fbg_readings (sensor_id, timestamp, strain_value, wavelength, is_simulated)
SELECT '60000000-0000-0000-0000-000000000020', t,
  206 + (RANDOM() * 6 - 3), 1549.120 + (RANDOM() * 0.01 - 0.005), TRUE
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '2 hours') AS t;
