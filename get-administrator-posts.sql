-- Gets posts created by 'Administrator' users
SELECT *
FROM wordpress.wp_posts
WHERE post_author IN (
	SELECT user_id
	FROM wordpress.wp_usermeta
    WHERE meta_key = 'wp_capabilities'
	AND meta_value LIKE '%administrator%'
)