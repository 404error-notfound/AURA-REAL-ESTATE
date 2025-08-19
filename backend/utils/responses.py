from flask import jsonify

def success_response(data=None, message=None, status_code=200):
    response = {
        "status": "success",
        "data": data
    }
    if message:
        response["message"] = message
    return jsonify(response), status_code

def error_response(error, message=None, status_code=400):
    response = {
        "status": "error",
        "error": error
    }
    if message:
        response["message"] = message
    return jsonify(response), status_code
