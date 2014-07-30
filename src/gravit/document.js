(function (_) {
    /**
     * An instance of an opened document
     * @class GDocument
     * @extends GEventTarget
     * @constructor
     */
    function GDocument(scene, url, title) {
        this.setUrl(url);
        this._scene = scene;
        this._editor = new IFEditor(scene);
        this._windows = [];
        this._activeWindow = null;
        // TODO : I18N
        this._title = title;

        // Provide an url resolver to our scene
        this._scene.addEventListener(IFScene.ResolveUrlEvent, this._resolveUrl, this);
    };
    IFObject.inherit(GDocument, GEventTarget);

    /**
     * The underlying scene
     * @type {IFScene}
     * @private
     */
    GDocument.prototype._scene = null;

    /**
     * The underlying url, may be null
     * @type {String}
     * @private
     */
    GDocument.prototype._url = null;

    /**
     * The underlying editor working on the document
     * @type {IFSceneEditor}
     * @private
     */
    GDocument.prototype._editor = null;

    /**
     * The windows attached to the document
     * @type {Array<GWindow>}
     * @private
     */
    GDocument.prototype._windows = null;

    /**
     * The currently active window of this document
     * @type {GWindow}
     * @private
     */
    GDocument.prototype._activeWindow = null;

    /**
     * The title of the document
     * @type {String}
     * @private
     */
    GDocument.prototype._title = null;

    /**
     * Returns the scene this document is working on
     * @returns {IFScene}
     */
    GDocument.prototype.getScene = function () {
        return this._scene;
    };

    /**
     * Return the underlying storage if any
     * @returns {GStorage}
     */
    GDocument.prototype.getStorage = function () {
        return this._storage;
    };

    /**
     * Returns the url this document is working on if any
     * @returns {String}
     */
    GDocument.prototype.getUrl = function () {
        return this._url;
    };

    /**
     * Assigns an url this document is working on
     * @param {String} url
     */
    GDocument.prototype.setUrl = function (url) {
        if (url !== this._url) {
            this._url = url;
            this._storage = url ? gApp.getStorage(url) : null;
        }
    };

    /**
     * Return the underlying editor
     * @returns {IFSceneEditor}
     */
    GDocument.prototype.getEditor = function () {
        return this._editor;
    };

    /**
     * Returns a list of all windows attached to this document
     * @return {Array<GWindow>}
     */
    GDocument.prototype.getWindows = function () {
        return this._windows;
    };

    /**
     * Returns the currently active window of this document
     * @return {GWindow}
     */
    GDocument.prototype.getActiveWindow = function () {
        return this._activeWindow;
    };

    /**
     * Returns the title for the document
     * @return {String}
     */
    GDocument.prototype.getTitle = function () {
        return this._title;
    };

    /**
     * Returns whether this document is saveable which
     * is the case if it has an underyling, valid url
     * and when it's internal editor's undo list has
     * modifications.
     * @return {Boolean}
     */
    GDocument.prototype.isSaveable = function () {
        return !!this._storage;
    };

    /**
     * Saves the document if it has an underlying url
     */
    GDocument.prototype.save = function () {
        // TODO : Reset undo list/set save point
        if (this._url) {
            var input = IFNode.serialize(this._scene);
            var output = pako.deflate(input);
            this._storage.save(this._url, output.buffer, true, function (name) {
                this._title = name;
            }.bind(this));
        }
    };

    /**
     * Called before this document gets activated
     */
    GDocument.prototype.activate = function () {
        // NO-OP
    };

    /**
     * Called before this document gets deactivated
     */
    GDocument.prototype.deactivate = function () {
        // NO-OP
    };

    /**
     * Called when this document gets closed
     */
    GDocument.prototype.close = function () {
        this._scene.removeEventListener(IFScene.ResolveUrlEvent, this._resolveUrl, this);
    };

    /**
     * @param {IFScene.ResolveUrlEvent} evt
     * @private
     */
    GDocument.prototype._resolveUrl = function (evt) {
        //if (this._storage) {
        //    this._storage.resolve
        //}
        //alert('RESOLVE_URL: ' + evt.url);

        // TODO : Make url absolute to document url if any

        evt.resolved(evt.url);
    };

    _.GDocument = GDocument;
})(this);
