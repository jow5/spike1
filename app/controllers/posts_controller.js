load('application');

before(loadPost, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.post = new Post;
    this.title = 'New post';
    render();
});

action('create', function () {
    this.post = new Post;
    ['title', 'content'].forEach(function (field) {
        if (typeof body[field] !== 'undefined') {
            this.post[field] = body[field];
        }
    }.bind(this));
    this.post.save(function (errors) {
        if (errors) {
            this.title = 'New post';
            flash('error', 'Post can not be created');
            render('new');
        } else {
            flash('info', 'Post created');
            redirect(path_to.posts);
        }
    }.bind(this));
});

action('index', function () {
    Post.find(function (err, posts) {
        this.posts = posts;
        this.title = 'Posts index';
        render();
    }.bind(this));
});

action('show', function () {
    this.title = 'Post show';
    render();
});

action('edit', function () {
    this.title = 'Post edit';
    render();
});

action('update', function () {
    ['title', 'content'].forEach(function (field) {
        if (typeof body[field] !== 'undefined') {
            this.post[field] = body[field];
        }
    }.bind(this));

    this.post.save(function (err) {
        if (!err) {
            flash('info', 'Post updated');
            redirect(path_to.post(this.post));
        } else {
            this.title = 'Edit post details';
            flash('error', 'Post can not be updated');
            render('edit');
        }
    }.bind(this));
});

action('destroy', function () {
    this.post.remove(function (error) {
        if (error) {
            flash('error', 'Can not destroy post');
        } else {
            flash('info', 'Post successfully removed');
        }
        send("'" + path_to.posts + "'");
    });
});

function loadPost () {
    Post.findById(params.id, function (err, post) {
        if (err || !post) {
            redirect(path_to.posts);
        } else {
            this.post = post;
            next();
        }
    }.bind(this));
}
