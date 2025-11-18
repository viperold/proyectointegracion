"""Inicialización del proyecto INACAP Projects.

Si se usa MariaDB/MySQL en Windows, habilitamos PyMySQL como reemplazo de MySQLdb
para evitar problemas de compilación de mysqlclient.
"""

try:
	import pymysql  # type: ignore
	pymysql.install_as_MySQLdb()
except Exception:
	# Si no está instalado aún (por ejemplo antes de pip install), lo ignoramos.
	pass
