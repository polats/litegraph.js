function AvatarImage() {
    this.addOutput("frame", "image");
    this.properties = { url: "https://avataaars.io/" };
}

AvatarImage.title = "Avatar";
AvatarImage.desc = "Avatar loader";
AvatarImage.widgets = [{ name: "load", text: "Load", type: "button" }];

AvatarImage.supported_extensions = ["jpg", "jpeg", "png", "gif"];

AvatarImage.prototype.onAdded = function() {
    if (this.properties["url"] != "" && this.img == null) {
        this.loadImage(this.properties["url"]);
    }
};

AvatarImage.prototype.onDrawForeground = function(ctx) {
    if (this.flags.collapsed) {
        return;
    }
    if (this.img && this.size[0] > 5 && this.size[1] > 5 && this.img.width) {
        ctx.drawImage(this.img, 0, 0, this.size[0], this.size[1]);
    }
};

AvatarImage.prototype.onExecute = function() {
    if (!this.img) {
        this.boxcolor = "#000";
    }
    if (this.img && this.img.width) {
        this.setOutputData(0, this.img);
    } else {
        this.setOutputData(0, null);
    }
    if (this.img && this.img.dirty) {
        this.img.dirty = false;
    }
};

AvatarImage.prototype.onPropertyChanged = function(name, value) {
    this.properties[name] = value;
    if (name == "url" && value != "") {
        this.loadImage(value);
    }

    return true;
};

AvatarImage.prototype.loadImage = function(url, callback) {
    if (url == "") {
        this.img = null;
        return;
    }

    this.img = document.createElement("img");

    if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
        url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
    }

    this.img.src = url;
    this.boxcolor = "#F95";
    var that = this;
    this.img.onload = function() {
        if (callback) {
            callback(this);
        }
        that.trace(
            "Image loaded, size: " + that.img.width + "x" + that.img.height
        );
        this.dirty = true;
        that.boxcolor = "#9F9";
        that.setDirtyCanvas(true);
    };
    this.img.onerror = function() {
  console.log("error loading the image:" + url);
}
};

AvatarImage.prototype.onWidget = function(e, widget) {
    if (widget.name == "load") {
        this.loadImage(this.properties["url"]);
    }
};

AvatarImage.prototype.onDropFile = function(file) {
    var that = this;
    if (this._url) {
        URL.revokeObjectURL(this._url);
    }
    this._url = URL.createObjectURL(file);
    this.properties.url = this._url;
    this.loadImage(this._url, function(img) {
        that.size[1] = (img.height / img.width) * that.size[0];
    });
};

LiteGraph.registerNodeType("game3/avatar", AvatarImage);
