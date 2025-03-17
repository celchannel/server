DROP DATABASE IF EXISTS postgres;
-- Change the type of database (by default template databases cannot be deleted)
ALTER DATABASE template0 IS_TEMPLATE FALSE;
ALTER DATABASE template1 IS_TEMPLATE FALSE;
DROP DATABASE IF EXISTS template0;
DROP DATABASE IF EXISTS template1;
