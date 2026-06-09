import MySQLdb

db = MySQLdb.connect(
    host="localhost",
    user="root",
    passwd="Kkunche@000",
    db="myhome"
)

print("Database Connected Successfully")