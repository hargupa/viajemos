<?php
    $appid='bxmGCOOF';
    $consumerkey='dj0yJmk9R2FUSmFteDh6SFRiJmQ9WVdrOVluaHRSME5QVDBZbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWJi';
    $consumersecret='e94e5f2b0fa2989e3422a64cc4cd0a3e9cd7032b';
    $ciudad = $_GET['ciudad'];

function buildBaseString($baseURI, $method, $params) {
    $r = array();
    ksort($params);
    foreach($params as $key => $value) {
        $r[] = "$key=" . rawurlencode($value);
    }
    return $method . "&" . rawurlencode($baseURI) . '&' . rawurlencode(implode('&', $r));
}

function buildAuthorizationHeader($oauth) {
    $r = 'Authorization: OAuth ';
    $values = array();
    foreach($oauth as $key=>$value) {
        $values[] = "$key=\"" . rawurlencode($value) . "\"";
    }
    $r .= implode(', ', $values);
    return $r;
}

$url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
$app_id = $appid;
$consumer_key = $consumerkey;
$consumer_secret = $consumersecret;

$query = array(
    'location' => "'". $ciudad . ",eu'",
    'format' => 'json',
);

$oauth = array(
    'oauth_consumer_key' => $consumer_key,
    'oauth_nonce' => uniqid(mt_rand(1, 1000)),
    'oauth_signature_method' => 'HMAC-SHA1',
    'oauth_timestamp' => time(),
    'oauth_version' => '1.0'
);

$base_info = buildBaseString($url, 'GET', array_merge($query, $oauth));
$composite_key = rawurlencode($consumer_secret) . '&';
$oauth_signature = base64_encode(hash_hmac('sha1', $base_info, $composite_key, true));
$oauth['oauth_signature'] = $oauth_signature;

$header = array(
    buildAuthorizationHeader($oauth),
    'X-Yahoo-App-Id: ' . $app_id
);
$options = array(
    CURLOPT_HTTPHEADER => $header,
    CURLOPT_HEADER => false,
    CURLOPT_URL => $url . '?' . http_build_query($query),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false
);

$ch = curl_init();
curl_setopt_array($ch, $options);
$response = curl_exec($ch);
curl_close($ch);


//print_r($response);
$return_data = json_decode($response,true);
//var_dump($return_data);
$lat = $return_data['location']['lat'];
$long = $return_data['location']['long'];
$ciudadRespuesta = $return_data['location']['city'];
$region = $return_data['location']['region'];
$humedad = $return_data['current_observation']['atmosphere']['humidity'];
 echo  $lat.','.$long . ',' . $ciudadRespuesta . ',' . $region . ',' . $humedad;



?>