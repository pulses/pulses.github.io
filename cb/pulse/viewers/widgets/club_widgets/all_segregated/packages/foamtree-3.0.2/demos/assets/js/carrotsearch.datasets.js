/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Copyright 2002-2014, Carrot Search s.c, All Rights Reserved.
 *
 *
 * Handles the data sets section of the settings panel.
 *
 * Please see demos/settings.html for the usage example.
 */
(function ($) {
  $.pluginhelper.make("datasets", function (element, options) {
    var $container = $(element);

    // Templates
    var sectionTemplate = Template.make(
     '<section class="links">\
        <header><h4>Data sets</h4></header>\
      </section>');
    var categoryTemplate = Template.make("<section><header><h5><%= label %></h5></header></section>");
    var datasetLinkTemplate = Template.make('<a class="dataset" href="<%- url %>"><%- label %></a>');

    var dialogTemplate = Template.make(
      '<div class="data-json modal fade in" tabindex="-1" role="dialog">\
        <div class="modal-dialog">\
          <div class="modal-content">\
            <div class="modal-header">\
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
              <h4 class="modal-title">Paste JSON data to visualize</h4>\
              <div>Data must be in the <a href="../api/index.html#dataObject" target="_blank">FoamTree data format</a></div>\
            </div>\
            <div class="modal-body">\
              <textarea class="json form-control"><%= json %></textarea>\
              <span class="help-block error">&nbsp;</span>\
            </div>\
            <div class="modal-footer">\
              <button type="button" class="visualize btn btn-primary">Visualize</button>\
            </div>\
          </div>\
        </div>\
      </div>');

    // Initialize dataset sections
    var $datasets = $(sectionTemplate()).appendTo($container);
    $.each(options.categories, function (index, category) {
      var $category = $(categoryTemplate(category));
      $category.append(category.datasets.reduce(function (html, dataset) {
        html += datasetLinkTemplate(dataset);
        return html;
      }, ""));
      $category.appendTo($datasets);
    });

    $datasets.on("click", "a.dataset", function(e) {
      options.onLoadingStart();
      JSONP.load(this.href, "modelDataAvailable", function(data) {
        options.onChange(data);
      });
      e.preventDefault();
    });

    // Initialize the JSON input link
    var exampleData = {
      groups: [
        { label: "Group 1", weight: 1 },
        {
          label: "Group 2", weight: 2, groups: [
            { label: "Group 2.2", weight: 1 },
            { label: "Group 2.2", weight: 0.5 }
          ]
        }
      ]
    };
    var $dialog = $(dialogTemplate({json: JSON.stringify(exampleData, null, 2)})).modal({
      show: false,
      keyboard: true
    });
    var $json = $dialog.find(".json");
    var $error = $dialog.find(".error");

    $("<section><a href='#json'>\
        <i class='fa fa-lg fa-paste'></i> Paste JSON</a>\
      </section>")
    .appendTo($datasets).find("a").click(function(e) {
      $dialog.modal('show');
      e.preventDefault();
    });

    $dialog.find(".visualize").click(function() {
      try {
        $error.html("&nbsp;");
        options.onLoadingStart();
        var dataObject = JSON.parse($json.val());
        $dialog.modal('hide');
        options.onChange(dataObject);
      } catch (e) {
        $error.text("Invalid JSON data: " + e);
      }
    });


    // Don't search data sets at all
    $container.on("search", function(e, prefix) {
      $datasets.toggle($.trim(prefix).length === 0);
    });

    // Load some default data set
    setTimeout(function() {
      $container.find(".dataset:eq(2)").trigger("click");
    }, 1);
  });
})(jQuery);