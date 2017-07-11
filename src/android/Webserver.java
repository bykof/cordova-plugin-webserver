package org.apache.cordova.plugin;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;


public class Webserver extends CordovaPlugin {

    public HashMap<String, Object> responses;
    public CallbackContext onRequestCallbackContext;

    private NanoHTTPDWebserver nanoHTTPDWebserver;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.responses = new HashMap<String, Object>();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("start".equals(action)) {
            try {
                this.start(args, callbackContext);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return true;
        }
        else if ("stop".equals(action)) {
            this.stop(args, callbackContext);
            return true;
        }
        else if ("onRequest".equals(action)) {
            this.onRequest(args, callbackContext);
            return true;
        }
        else if ("onResponse".equals(action)) {
            this.onResponse(args, callbackContext);
            return true;
        }
        return false;  // Returning false results in a "MethodNotFound" error.
    }

    /**
     * Starts the server
     * @param args
     * @param callbackContext
     */
    private void start(JSONArray args, CallbackContext callbackContext) throws JSONException, IOException {
        int port = 8080;

        if (args.length() == 1) {
            port = args.getInt(0);
        }
        this.nanoHTTPDWebserver = new NanoHTTPDWebserver(port, this);
        this.nanoHTTPDWebserver.start();
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
    }

    /**
     * Stops the server
     * @param args
     * @param callbackContext
     */
    private void stop(JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (this.nanoHTTPDWebserver != null) {
            this.nanoHTTPDWebserver.stop();
        }
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
    }

    /**
     * Will be called if the js context sends an response to the webserver
     * @param args {UUID: {...}}
     * @param callbackContext
     * @throws JSONException
     */
    private void onResponse(JSONArray args, CallbackContext callbackContext) throws JSONException {
        this.responses.put(args.getString(0), args.get(1));
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
    }

    /**
     * Just register the onRequest and send no result. This is needed to save the callbackContext to
     * invoke it later
     * @param args
     * @param callbackContext
     */
    private void onRequest(JSONArray args, CallbackContext callbackContext) {
        this.onRequestCallbackContext = callbackContext;
        PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
        pluginResult.setKeepCallback(true);
        this.onRequestCallbackContext.sendPluginResult(pluginResult);
    }
}
