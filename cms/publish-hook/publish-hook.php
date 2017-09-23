<?php
/*
Plugin Name:  Publish Hook
Description:  Send hooks on publish, unpublish, and save draft.
Version:      1.0.0
Author:       Ryan Haskell-Glatz
*/


// Configuration
function publishhook_get_endpoint ( $relativeUrl = '' ) {
    return getenv('WP_ENDPOINT_URL').$relativeUrl;
}
function publishhook_get_token () {
    return getenv('WP_SECRET_TOKEN');
}
function publishhook_use_rest_api () {
    return false;
}


// Debugging
function publishhook_log ( $message ) {
    file_put_contents( 'php://stdout', "PUBLISH HOOK PLUGIN: ".$message."\n" );
}
function publishhook_error ( $message ) {
    file_put_contents( 'php://stderr', "PUBLISH HOOK PLUGIN: ".$message."\n" );
}


// Web requests
function publishhook_post ($url, $body) {
    return wp_remote_post( $url, array(
        'method' => 'POST',
        'timeout' => 15,
        'redirection' => 5,
        'httpversion' => '1.0',
        'blocking' => true,
        'headers' => array( 'Content-Type' => 'application/json' ),
        'body' => json_encode($body),
        'cookies' => array()
        )
    );
}

function publishhook_post_with_message ($action) {
    return publishhook_post(publishhook_get_endpoint(), array(
        'token' => publishhook_get_token(),
        'action' => $action
    ));
}

function publishhook_log_response ($response) {
    if (is_wp_error($response)) {
        publishhook_error($response->get_error_message());
    } else {
        $data = wp_remote_retrieve_body($response);
        publishhook_log($data);
    }
    return $response;
}


// Functions
function publishhook_post_saved ($post_id, $post) {
    publishhook_log($post->post_type.' '.$post_id.' has status "'.$post->post_status.'".');

    $acf = array();

    if (publishhook_use_rest_api()) {
        publishhook_log('Fetching post meta through REST API...');
        // ... request to self
    } else {
        publishhook_log('Fetching post meta through "get_post_meta"...');
        $post_meta = get_post_meta($post_id);
        $acf = publishhook_transform_post_meta_to_acf($post_meta);
    }

    $response = publishhook_post(publishhook_get_endpoint(), array(
        'token' => publishhook_get_token(),
        'data' => array(
            'id' => $post_id,
            'slug' => $post->post_name,
            'type' => $post->post_type,
            'status' => $post->post_status,
            'acf' => $acf
        )
    ));

    publishhook_log_response($response);
}

function publishhook_doesnt_start_with_underscore ($word) {
    return substr($word, 0, 1) != "_";
}

function publishhook_transform_post_meta_to_acf ($post_meta) {
    $meta = array_filter($post_meta, 'publishhook_doesnt_start_with_underscore', ARRAY_FILTER_USE_KEY);
    $meta = array_map('array_shift', $meta);
    return $meta;
}

// Actions
function publishhook_add_all_actions () {
    add_action("save_post", "publishhook_post_saved", 10 , 2);
}

// Plugin Lifecycle
// (https://developer.wordpress.org/plugins/the-basics/activation-deactivation-hooks/)
// (https://developer.wordpress.org/plugins/the-basics/uninstall-methods/)
function publishhook_activate () {
    publishhook_log('Plugin activated.');
    global $publishhook_is_activated;
    $publishhook_is_activated = true;
}

function publishhook_deactivate () {
    publishhook_log('Plugin deactivated.');
    global $publishhook_is_activated;
    $publishhook_is_activated = false;
}

function publishhook_uninstall () {
    publishhook_log('Plugin uninstalled.');
    global $publishhook_is_activated;
    $publishhook_is_activated = false;
}

register_activation_hook( __FILE__, 'publishhook_activate' );
register_deactivation_hook( __FILE__, 'publishhook_deactivate' );
register_uninstall_hook( __FILE__, 'publishhook_uninstall' );

$isPluginActive = !isset($publishhook_is_activated) || $publishhook_is_activated != true;

if ($isPluginActive) {
    publishhook_add_all_actions();
}