// activation line template
export const signupActivationLinkTemplate = (link) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            max-width: 100%;
            height: auto;
        }

        h1 {
            color: #333333;
        }

        p {
            color: #666666;
            line-height: 1.6;
        }

        .btn {
            display: inline-block;
            padding: 15px 25px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #45a049;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="YOUR_HEADER_IMAGE_URL" alt="Job APP">
        </div>

        <h1>Welcome to Job APP!</h1>
        <p>Thank you for signing up. To activate your account, please click the button below:</p>
        
        <a class="btn" href=${link}>Activate Your Account</a>

        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style={color: "black";}><a href=${link}>${link}</a></p>

        <p>If you didn't sign up for Job APP, please ignore this email.</p>

        <div class="footer">
            <p>Best regards,<br>Job APP Team</p>
        </div>
    </div>
</body>
</html>`;

// forget code template
export const forgetCodeTemplate = (code) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forget Code</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #3498db;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
        }

        p {
            color: #ffffff;
            line-height: 1.6;
        }

        .code {
            font-size: 24px;
            background-color: #ffffff;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: inline-block;
            color: white;
        }

        .footer {
            text-align: center;
            color: #ecf0f1;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Forget Code</h1>
        <p>We received a request for a verification code. If you did not make this request, please ignore this email.</p>
        
        <p>Your verification code is:</p>
        <div class="code">${code}</div>

        <p>This code is valid only for 10 minutes for security reasons.</p>

        <div class="footer">
            <p>Best regards,<br>Job APP Team</p>
        </div>
    </div>
</body>
</html>`;
