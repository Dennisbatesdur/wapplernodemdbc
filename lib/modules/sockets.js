exports.emit = function(options) {
    if (this.io) {
        options = this.parse(options);

        if (options.namespace) {
            if (options.room) {
                this.io.of(options.namespace).to(options.room).emit(options.eventName, options.params);
            } else {
                this.io.of(options.namespace).emit(options.eventName, options.params);
            }
        } else {
            if (options.room) {
                this.io.in(options.room).emit(options.eventName, options.params);
            } else {
                this.io.emit(options.eventName, options.params);
            }
        }
    }
};

exports.broadcast = function(options) {
    if (this.socket) {
        options = this.parse(options);

        if (options.room) {
            this.socket.to(options.room).emit(options.eventName, options.params);
        } else {
            this.socket.emit(options.eventName, options.params);
        }
    }
};

exports.request = function(options) {
    if (this.socket) {
        options = this.parse(options);

        return new Promise((resolve) => {
            this.io.to(this.socket.id).emit(options.eventName, options.params, resolve);
        });
    }

    return null;
};

exports.message = function(options) {
    if (this.io) {
        options = options.this.parse(options);

        this.io.to(options.socketId).emit(options.eventName, options.params);
    }
}

exports.join = function(options) {
    if (this.socket) {
        this.socket.join(this.parse(options.room));
    }
};

exports.leave = function(options) {
    if (this.socket) {
        this.socket.leave(this.parse(options.room));
    }
};

exports.identify = function(options) {
    return this.socket ? this.socket.id : null;
};

exports.rooms = function(options) {
    return this.socket ? Array.from(this.socket.rooms) : [];
};

exports.allRooms = async function(options) {
    if (this.io) {
        let adapter = io.of(options.namespace || '/').adapter;

        if (typeof adapter.allRooms == 'function') {
            return Array.from(await adapter.allRooms());
        } else if (adapter.rooms) {
            return Array.from(adapter.rooms.keys());
        }
    }

    return [];
};

exports.allSockets = async function(options) {
    if (this.io) {
        options = this.parse(options);

        if (options.room) {
            return Array.from(await this.io.of(options.namespace || '/').in(options.room).allSockets());
        } else {
            return Array.from(await this.io.of(options.namespace || '/').allSockets());
        }
    }

    return [];
};

