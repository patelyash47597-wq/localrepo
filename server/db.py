import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Aa@123456",
        database="job_portal",
        auth_plugin="mysql_native_password"
    )
