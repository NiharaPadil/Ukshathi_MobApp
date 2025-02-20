import bcrypt
import mysql.connector
from mysql.connector import errorcode
import getpass
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve environment variables
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
PEPPER_SECRET = os.getenv("PEPPER_SECRET")

# Function to generate bcrypt hash with salt and pepper
def generate_bcrypt(password, pepper):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8') + pepper.encode('utf-8'), salt)
    return salt, hashed_password.decode('utf-8')

# Function to generate the next custom ID for controllers, nodes, or valves
def generate_next_id(cnx, table, prefix):
    cursor = cnx.cursor(buffered=True)
    query = f"SELECT MAX(CONVERT(SUBSTRING({table}ID, 2), UNSIGNED INTEGER)) FROM {table}"
    cursor.execute(query)
    max_id = cursor.fetchone()[0]
    cursor.close()

    if max_id is None:
        next_id = 1
    else:
        next_id = max_id + 1

    return f"{prefix}{next_id}"

# Function to insert username, hashed password, and salt into MySQL database
def insert_user_login(cnx, user_id, username, hashed_password, salt):
    cursor = cnx.cursor()
    insert_query = "INSERT INTO userLogin (userID, userEmail, passwordHash, passwordSalt) VALUES (%s, %s, %s, %s)"
    cursor.execute(insert_query, (user_id, username, hashed_password, salt))
    cnx.commit()
    cursor.close()
    return cursor.lastrowid


# Function to insert user details into userData table
def insert_user_data(cnx, user_id, user_email, first_name, last_name, phone_number, address, city, state):
    cursor = cnx.cursor()
    add_user_data = ("INSERT INTO userData (userID, firstName, lastName, phoneNumber, userEmail, address, city, state) "
                     "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)")
    cursor.execute(add_user_data, (user_id, first_name, last_name, phone_number, user_email, address, city, state))
    cnx.commit()
    cursor.close()
    
# Function to insert details to the fetch table and default schedule to schedule table
def insert_fetch(cnx, user_id, controller_id, node_id, valve_id, controller_name, node_name, valve_name, zone_name):
    cursor = cnx.cursor()
    
    # Insert into fetch table
    add_fetch = ("INSERT INTO `fetch` (userID, controllerID, nodeID, valveID, controllerName, nodeName, valveName, zoneName)"
                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)")
    cursor.execute(add_fetch, (user_id, controller_id, node_id, valve_id, controller_name, node_name, valve_name, zone_name))
    
    # Insert default schedule for the new valve
    add_schedule = ("INSERT INTO schedule (valveID, startDate, duration, time, scheduleChange, onoff, weather) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s)")
    default_values = (valve_id, '2024-01-01', 4, '09:00:00', 0, 1, 0)
    cursor.execute(add_schedule, default_values)
    
    cnx.commit()
    cursor.close()


# Function to establish connection to MySQL database
def connect_to_db():
    try:
        cnx = mysql.connector.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            database=DB_NAME
        )
        return cnx
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    return None

# Function to add a new user
def add_new_user(cnx):
    user_email = input("Enter your email: ")
    cursor = cnx.cursor(buffered=True) #Buffered to avoid lazy loading

    # To Check if the user exists
    cursor.execute('SELECT * FROM userLogin WHERE userEmail = %s', (user_email,))
    checkUsername = cursor.fetchone()
    if checkUsername is not None:
        print('User already exists')
    else:
        password = getpass.getpass("Enter your password: ")

        # Our secret pepper
        pepper = "6969"

        # Generate bcrypt hash with salt and pepper
        salt, hashed_password = generate_bcrypt(password, pepper)
        cursor = cnx.cursor()
        cursor.execute("SELECT MAX(userID) FROM userLogin")
        result = cursor.fetchone()
        user_id = (result[0] or 0) + 1
        cursor.close()
        
        insert_user_login(cnx, user_id, user_email, hashed_password, salt.decode('utf-8'))

        # Gather user details
        first_name = input("Enter your first name: ")
        last_name = input("Enter your last name: ")
        phone_number = input("Enter your phone number: ")
        address = input("Enter your address: ")
        city = input("Enter your city: ")
        state = input("Enter your state: ")

        insert_user_data(cnx, user_id, user_email, first_name, last_name, phone_number, address, city, state)

        return user_id

# Function to validate password during login
def validate_password(stored_password, salt, password, pepper):
    hashed_password = bcrypt.hashpw(password.encode('utf-8') + pepper.encode('utf-8'), salt.encode('utf-8'))
    return hashed_password.decode('utf-8') == stored_password

# Function for user login
def user_login(cnx):
    user_email = input("Enter your email: ")
    password = getpass.getpass("Enter your password: ")

    cursor = cnx.cursor(buffered=True)
    query = ("SELECT userID, passwordHash, passwordSalt FROM userLogin WHERE userEmail = %s")
    cursor.execute(query, (user_email,))

    user = cursor.fetchone()
    cursor.close()

    if user:
        user_id, password_hash, password_salt = user
        pepper = "6969"  # Our secret pepper

        if validate_password(password_hash, password_salt, password, pepper):
            print("Login successful")
            return user_id
        else:
            print("Invalid password")
    else:
        print("User not found")

    return None

# Function to reset password
def forgot_password(cnx):
    user_email = input("Enter your email: ")
    cursor = cnx.cursor(buffered=True) #Buffered to avoid lazy loading

    # To Check if the user exists
    cursor.execute('SELECT * FROM userLogin WHERE userEmail = %s', (user_email,))
    checkUsername = cursor.fetchone()
    if checkUsername is None:
        print('User does not exist')
    else:
        new_password = getpass.getpass("Enter your new password: ")

        # Our secret pepper
        pepper = "6969"

        # Generate bcrypt hash with salt and pepper
        salt, hashed_password = generate_bcrypt(new_password, pepper)

        update_password = ("UPDATE userLogin SET passwordHash = %s, passwordSalt = %s WHERE userEmail = %s")
        cursor.execute(update_password, (hashed_password, salt.decode('utf-8'), user_email))
        cnx.commit()
        cursor.close()
        print("Password Changed")

# Function to add device details for a usee

#madenew chnages for repating adding of values(li):
def add_device_to_user(cnx, user_id):
    cursor = cnx.cursor()
    device_map = {'1': 'Uno', '2': 'Quadra', '3': 'Hexa', '4': 'Octa'}
    
    while True:
        device_type_num = input("Enter device type (1: Uno, 2: Quadra, 3: Hexa, 4: Octa): ")
        device_type = device_map.get(device_type_num)
        
        if not device_type:
            print("Invalid device type")
            continue
        

        if device_type == 'Quadra':
            num_controllers = int(input("Enter number of controllers: "))
            

            for controller_index in range(1, num_controllers + 1):
                print(f"Currently entering values for Controller {controller_index}")
                
                controller_name = input("Enter controller name: ")
                controller_id = generate_next_id(cnx, 'controller', 'C')

                add_controller = ("INSERT INTO controller (controllerID, controllerName, userID, deviceType) VALUES (%s, %s, %s,%s)")
                cursor.execute(add_controller, (controller_id, controller_name, user_id, device_type))

                num_nodes = int(input(f"Enter number of nodes for Controller {controller_index}: "))

                for _ in range(num_nodes):
                    node_name = input("Enter node name: ")
                    zone_name = input("Enter Zone name: ")
                    battery_voltage = input("Enter battery voltage: ")
                    node_id = generate_next_id(cnx, 'node', 'N')

                    add_node = ("INSERT INTO node (nodeID, nodeName, batteryVoltage, controllerID) VALUES (%s, %s, %s, %s)")
                    cursor.execute(add_node, (node_id, node_name, battery_voltage, controller_id))

                    num_valves = int(input("Enter number of valves: "))
                    for i in range(num_valves):
                        valve_name = input(f"Enter valve name for valve {i+1}: ")
                        valve_id = generate_next_id(cnx, 'valve', 'V')

                        add_valve = ("INSERT INTO valve (valveID, valveName, controllerID, nodeID,userID) VALUES (%s, %s, %s, %s,%s)")
                        cursor.execute(add_valve, (valve_id, valve_name, controller_id, node_id,user_id))
                        insert_fetch(cnx, user_id, controller_id, node_id, valve_id, controller_name, node_name, valve_name, zone_name)
        
        elif device_type == 'Octa':
            controller_name = input("Enter controller name: ")
            node_name = input("Enter node name: ")
            zone_name= input(f"Enter Zone name: ")
            battery_voltage = input("Enter battery voltage: ")
            controller_id = generate_next_id(cnx, 'controller', 'C')

            add_controller = ("INSERT INTO controller (controllerID, controllerName, userID , deviceType) VALUES (%s, %s, %s,%s)")
            cursor.execute(add_controller, (controller_id, controller_name, user_id,device_type))

            node_id = generate_next_id(cnx, 'node', 'N')
            add_node = ("INSERT INTO node (nodeID, nodeName, batteryVoltage, controllerID) VALUES (%s, %s, %s, %s)")
            cursor.execute(add_node, (node_id, node_name, battery_voltage, controller_id))

            num_valves = int(input("Enter number of valves (up to 8): "))
            if num_valves > 8:
                num_valves = 8
            for i in range(num_valves):
                valve_name = input(f"Enter valve name for valve {i+1}: ")
                valve_id = generate_next_id(cnx, 'valve', 'V')
                
                add_valve = ("INSERT INTO valve (valveID, valveName, controllerID, nodeID,userID) VALUES (%s, %s, %s, %s,%s)")
                cursor.execute(add_valve, (valve_id, valve_name, controller_id, node_id,user_id))
                insert_fetch(cnx, user_id, controller_id, node_id, valve_id, controller_name, node_name, valve_name, zone_name)
        
        elif device_type in ['Uno', 'Hexa']:
            controller_name = input("Enter controller name: ")
            node_name = input("Enter node name: ")
            zone_name= input(f"Enter Zone name: ")
            battery_voltage = input("Enter battery voltage: ")
            controller_id = generate_next_id(cnx, 'controller', 'C')

            add_controller = ("INSERT INTO controller (controllerID, controllerName, userID,deviceType) VALUES (%s, %s, %s,%s)")
            cursor.execute(add_controller, (controller_id, controller_name, user_id,device_type))

            node_id = generate_next_id(cnx, 'node', 'N')
            add_node = ("INSERT INTO node (nodeID, nodeName, batteryVoltage, controllerID) VALUES (%s, %s, %s, %s)")
            cursor.execute(add_node, (node_id, node_name, battery_voltage, controller_id))

            valve_name = input(f"Enter valve name for valve  ")
            valve_id = generate_next_id(cnx, 'valve', 'V')

            add_valve = ("INSERT INTO valve (valveID, valveName, controllerID, nodeID,userID) VALUES (%s, %s, %s, %s,%s)")
            cursor.execute(add_valve, (valve_id, valve_name, controller_id, node_id,user_id))
            insert_fetch(cnx, user_id, controller_id, node_id, valve_id, controller_name, node_name, valve_name, zone_name)
        more_devices = input("Do you want to add another device? (yes/no): ").strip().lower()
        if more_devices != 'yes':
            break
    
    cnx.commit()
    cursor.close()

# Function to fetch and print user data
def fetch_user_data(cnx, user_id):
    cursor = cnx.cursor()
    query = ("SELECT * FROM userData WHERE userID = %s")
    cursor.execute(query, (user_id,))
    for row in cursor:
        print(row)
    cursor.close()

# Main function
def main():
    cnx = connect_to_db()
    if not cnx:
        return

    user_choice = input("Are you a new user, existing user, or forgot password? (new/existing/forgot): ").lower()
    user_id = None

    if user_choice == "new":
        user_id = add_new_user(cnx)
    elif user_choice == "existing":
        user_id = user_login(cnx)
    elif user_choice == "forgot":
        forgot_password(cnx)
    else:
        print("Invalid choice")

    if user_id:
        add_device_to_user(cnx, user_id)
        fetch_user_data(cnx, user_id)
        

    cnx.close()

if __name__ == "__main__":
    main()