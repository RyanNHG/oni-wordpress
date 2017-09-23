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

// Plugin Lifecycle
// (https://developer.wordpress.org/plugins/the-basics/activation-deactivation-hooks/)
// (https://developer.wordpress.org/plugins/the-basics/uninstall-methods/)
function publishhook_activate () {
    publishhook_log('Publish Hook plugin activated.');
}

function publishhook_deactivate () {
    publishhook_log('Publish Hook plugin deactivated.');
}

function publishhook_uninstall () {
    publishhook_log('Publish Hook plugin uninstalled.');
}

register_activation_hook( __FILE__, 'publishhook_activate' );
register_deactivation_hook( __FILE__, 'publishhook_deactivate' );
register_uninstall_hook( __FILE__, 'publishhook_uninstall' );