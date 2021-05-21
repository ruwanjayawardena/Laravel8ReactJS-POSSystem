<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-100">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{asset('css/app.css')}}" rel="stylesheet" />
    <link href="{{asset('css/custom-style.css')}}" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.3.1/css/hover-min.css"
        integrity="sha512-csw0Ma4oXCAgd/d4nTcpoEoz4nYvvnk21a8VA2h2dzhPAvjbUIK6V3si7/g/HehwdunqqW18RwCJKpD7rL67Xg=="
        crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
    <title>POS| Singha Hardware</title>
</head>

<body class="h-100">
    <div class="container-fluid dashboard-background">
        <div class="row">
            <div class="col-12 col-lg-12">
                <section class="center-item">
                    <h1 class="text-center text-white display-5 animated fadeInLeft slow my-3">POS Singha Hardware </h1>
                    <div class="row row-cols-1 row-cols-md-2 g-4 text-center">
                        <div class="col">
                            <a href="/Administrator">
                                <div class="card bg-secondary hvr-grow">
                                    <img src="./img/card/stock.png" class="card-img-top img-fluid" />
                                    <div class="card-body text-white">
                                        <h5 class="card-title">Stock Administration</h5>
                                        <p class="card-text">Configure POS Back-end.</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col">
                            <a href="/Cashier">
                                <div class="card bg-dark hvr-rotate">
                                    <img src="./img/card/bill.png" class="card-img-top img-fluid" />
                                    <div class="card-body text-white">
                                        <h5 class="card-title">Billing</h5>
                                        <p class="card-text">Chashier Billing Section</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <script src="{{asset('js/app.js')}}"></script>
</body>
<!-- <span class="fs-sm h-5"><small>singhahardwaremetal.com</small></span> -->
</html>