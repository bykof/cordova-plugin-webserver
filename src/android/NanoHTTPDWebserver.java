package org.apache.cordova.plugin;


import android.annotation.TargetApi;
import android.os.Build;

import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

import fi.iki.elonen.NanoHTTPD;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.UUID;

public class NanoHTTPDWebserver extends NanoHTTPD{

    Webserver webserver;

    public NanoHTTPDWebserver(int port, Webserver webserver) {
        super("0.0.0.0", port);
        this.webserver = webserver;
    }

    /**
     * Create a request object
     *
     * [
     *      "requestId": requestUUID,
     "      body": request.jsonObject ?? "",
     "      headers": request.headers,
     "      method": request.method,
     "      path": request.url.path,
     "      query": request.url.query ?? ""
        ]
     *
     * @param session
     * @return
     */
    private JSONObject createJSONRequest(String requestId, IHTTPSession session) throws JSONException {
        JSONObject jsonRequest = new JSONObject();
        jsonRequest.put("requestId", requestId);
        jsonRequest.put("body", session.getParameters());
        jsonRequest.put("headers", session.getHeaders());
        jsonRequest.put("method", session.getMethod());
        jsonRequest.put("path", session.getUri());
        jsonRequest.put("query", session.getQueryParameterString());
        return jsonRequest;
    }

    @Override
    public Response serve(IHTTPSession session) {
        String requestUUID = UUID.randomUUID().toString();

        PluginResult pluginResult = null;
        try {
            pluginResult = new PluginResult(
                    PluginResult.Status.OK, this.createJSONRequest(requestUUID, session));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        pluginResult.setKeepCallback(true);
        this.webserver.onRequestCallbackContext.sendPluginResult(pluginResult);

        while (!this.webserver.responses.containsKey(requestUUID)) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        JSONObject responseObject = (JSONObject) this.webserver.responses.get(requestUUID);
        Response response = null;
        try {
            response = newFixedLengthResponse(
                Response.Status.lookup(responseObject.getInt("status")),
                "text/plain",
                responseObject.getString("body")
            );

            Iterator<?> keys = responseObject.getJSONObject("headers").keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                response.addHeader(
                    key,
                    responseObject.getJSONObject("headers").getString(key)
                );
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return response;
    }
}
