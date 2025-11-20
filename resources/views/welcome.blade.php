<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page d'Accueil - Gestion de Courrier</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet"> <!-- Ajout de Bootstrap Icons -->
    <style>
        body {
            background: linear-gradient(135deg, #FFC107, #FF5722); /* Dégradé de couleurs */
            color: #333;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .container {
            background-color: rgba(255, 255, 255, 0.7); /* Fond blanc avec opacité ajustée */
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Ombre plus prononcée */
            border: 1px solid rgba(0, 0, 0, 0.1); /* Bordure légère */
            position: relative;
            z-index: 2;
        }
        .btn-custom {
            width: 200px;
            margin: 10px;
        }
        .decorative-shape {
            position: absolute;
            z-index: 1;
            opacity: 0.15;
        }
        .shape1, .shape2 {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
        }
        .shape1 {
            top: -50px;
            left: -50px;
        }
        .shape2 {
            bottom: -50px;
            right: -50px;
        }
    </style>
</head>
<body>
    <div class="decorative-shape shape1"></div>
    <div class="decorative-shape shape2"></div>
    <div class="container">
        <h1>Bienvenue dans votre Gestion de Courrier</h1>
        <p>Organisez vos lettres et colis facilement.</p>
        
        <div id="startButton">
            <button class="btn btn-success btn-custom" onclick="showOptions()">
                Commencer <i class="bi bi-arrow-right"></i>
            </button>
        </div>

        <div id="options" style="display: none;">
            <a href="{{route('login')}}"><button class="btn btn-success btn-custom" data-toggle="modal" data-target="#loginModal">
                Se connecter <i class="bi bi-box-arrow-in-right"></i>
            </button></a>
            <a href="{{route('register')}}"><button class="btn btn-info btn-custom" data-toggle="modal" data-target="#signupModal">
                S'inscrire <i class="bi bi-person-plus"></i>
            </button></a>
        </div>
                    
    </div>

    <!-- Scripts nécessaires -->
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    
    <script>
        function showOptions() {
            document.getElementById("startButton").style.display = "none"; // Cacher le bouton Commencer
            document.getElementById("options").style.display = "block"; // Afficher les options
        }
    </script>
</body>
</html>