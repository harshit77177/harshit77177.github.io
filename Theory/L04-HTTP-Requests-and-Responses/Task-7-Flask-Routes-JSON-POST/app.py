from flask import Flask, jsonify, request

app = Flask(__name__)

students = [
    {'id': 1, 'name': 'Harshit Singh', 'course': 'Backend Development'},
    {'id': 2, 'name': 'Jasprit', 'course': 'Node.js'},
    {'id': 3, 'name': 'Rohit', 'course': 'Flask'}
]


@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Flask API'})


@app.route('/about')
def about():
    return jsonify({
        'application': 'Task 7 Flask Routes, JSON and POST',
        'description': 'A simple Flask API'
    })


@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students)


@app.route('/students', methods=['POST'])
def add_student():
    student_data = request.get_json(silent=True)

    if not student_data:
        return jsonify({'error': 'Request body must contain JSON data'}), 400

    required_fields = ['name', 'course']
    missing_fields = [field for field in required_fields if not student_data.get(field)]

    if missing_fields:
        return jsonify({
            'error': 'Missing required fields',
            'fields': missing_fields
        }), 400

    new_student = {
        'id': len(students) + 1,
        'name': student_data['name'],
        'course': student_data['course']
    }
    students.append(new_student)

    return jsonify({
        'message': 'Student added successfully',
        'student': new_student
    }), 201


if __name__ == '__main__':
    app.run(debug=True, port=5000)