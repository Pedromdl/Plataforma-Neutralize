from database import get_connection

def test_connection():
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Executa uma consulta simples
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        print(f"Versão do PostgreSQL: {db_version}")
        
        # Consulta os produtos que você criou anteriormente
        cursor.execute("SELECT * FROM produtos;")
        produtos = cursor.fetchall()
        print("\nProdutos:")
        for produto in produtos:
            print(produto)
            
    except Exception as e:
        print(f"Erro: {e}")
    finally:
        if conn is not None:
            conn.close()
            print("\nConexão encerrada.")

if __name__ == "__main__":
    test_connection()