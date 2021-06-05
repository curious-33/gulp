<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>{{ title | title }}</title>

    <link rel="icon" type="image/ico" href="images/favicon.png" sizes="32x32">

    <!-- build:css styles/vendor.css -->
    <link rel="stylesheet" href="styles/normalize.css">
    <link rel="stylesheet" href="styles/bootstrap-grid.min.css">
    <!-- endbuild -->
    <!-- build:css styles/fonts.css -->
    <link href="styles/fonts.css" rel="stylesheet">
    <!-- endbuild -->
    <!-- build:css styles/main.css -->
    <link href="styles/main.css" rel="stylesheet">
    <!-- endbuild -->


</head>
<body>

<div class="page-wrapper">
    {% include('header.html') %}
    <div class="page-content">
        {% block content %} {% endblock %}
    </div>
    {% include('footer.html') %}
</div>

{% block scripts %} {% endblock %}

</body>

</html>
