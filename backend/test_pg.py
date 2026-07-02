from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgres://snowflake_admin:JNFdgf8aMEaawpuuce29tXV3jTHiicdoh5XZiMednIXFaJZs24Rlg7YpeBhMFRzJ@q6ayf7u5tbf6bob22izfsd4gga.skondys-et17731.southcentralus.azure.postgres.snowflake.app:5432/postgres"

try:
    import psycopg
    conn = psycopg.connect(DB_URI, autocommit=True)
    checkpointer = PostgresSaver(conn)
    checkpointer.setup()
    print("✅ Connection and setup successful!")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {e}")