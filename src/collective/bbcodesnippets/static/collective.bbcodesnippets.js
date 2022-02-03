"use strict";

require(["tinymce"], function (tinymce) {
  console.log("create and add collectivebbcodesnippets");
  var portalUrl = document.body.dataset["portalUrl"];
  var bbcodesnippet_enabled_url = portalUrl + "/@bbcodesnippets_enabled";

  // keep import for unknown reason, otherwise:
  var replace = function replace(selection, template) {
    var content = selection.getContent({
      format: "text",
    });
    var replaced = template.replace("$TEXT", content);
    var position = replaced.indexOf("$CURSOR");
    replaced = replaced.replace("$CURSOR", "");
    selection.setContent(replaced); // if (position >= 0) {
    //   selection.setCursorLocation(selection, position)
    // }
  };

  fetch(bbcodesnippet_enabled_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      tinymce.create("tinymce.plugins.CollectiveBBCodeSnippetsPlugin", {
        init: function init(editor) {
          editor.on("init", function () {
            console.log("editor on init!");
          }); // Adds a menu item to the tools menu

          data.forEach(function (entry, index) {
            var identifier = "bbcs" + entry.name;
            console.log(index + " " + identifier);
            editor.addMenuItem(identifier, {
              text: entry.name + " (" + entry.snippet + ")",
              context: "bbcs",
              onClick: function onClick() {
                replace(editor.selection, entry.template);
              },
            });
          });
        },
      });
      tinymce.PluginManager.add(
        "collectivebbcodesnippets",
        tinymce.plugins.CollectiveBBCodeSnippetsPlugin
      );
    })
    .catch(function (err) {
      console.log(err);
    });
})();
