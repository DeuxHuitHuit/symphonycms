/**
 * @package assets
 */

(function($, Symphony) {
	'use strict';

	/**
	 * Convert absolute to relative dates.
	 *
	 * @name $.symphonyTimeAgo
	 * @class
	 *
	 * @param {Object} options An object specifying containing the attributes specified below
	 * @param {String} [options.items='time'] Selector to find the absolute date
	 * @param {String} [options.timestamp='utc'] Attribute of `object.items` representing the timestamp of the given date
	 * @param {Integer} [options.max=0] Plugin will disable when the minutes exceed this value. By default this behaviour is off.
	 *
	 * @example

			$('.notifier').symphonyTimeAgo();
	 */
	$.fn.symphonyTimeAgo = function(options) {
		var objects = this,
			settings = {
				items: 'time',
				timestamp: 'utc',
				max: 0
			};

		$.extend(settings, options);

	/*-----------------------------------------------------------------------*/

		Symphony.Language.add({
			'just now': false,
			'a minute ago': false,
			'{$minutes} minutes ago': false,
			'about 1 hour ago': false,
			'about {$hours} hours ago': false
		});

	/*-------------------------------------------------------------------------
		Functions
	-------------------------------------------------------------------------*/

		function parse(item) {
			var timestamp = item.data('timestamp'),
				datetime;

			// Fetch stored timestamp
			if($.isNumeric(timestamp)) {
				return timestamp;
			}

			// Parse date
			else {
				datetime = item.attr(settings.timestamp);

				// Defined date and time
				if(datetime) {
					// Datetime will be in seconds since Epoch, JS requires
					// millseconds, so multiply by 1000.
					timestamp = new Date(datetime * 1000);
				}

				// Undefined date and time
				else {
					timestamp = new Date().getTime();
				}

				// Store and return timestamp
				item.data('timestamp', timestamp);
				return timestamp;
			}
		}

		function say(from, to) {

			// Calculate time difference
			var distance = to - from,

			// Convert time to minutes
			time = Math.floor(distance / 60000);

			// Return relative date based on passed time
			if(time < 1) {
				return Symphony.Language.get('just now');
			}
			if(time < 2) {
				return Symphony.Language.get('a minute ago');
			}
			if(time < 45) {
				return Symphony.Language.get('{$minutes} minutes ago', {
					'minutes': time
				});
			}
			if(time < 90) {
				return Symphony.Language.get('about 1 hour ago');
			}
			else if (!settings.max || time < settings.max) {
				return Symphony.Language.get('about {$hours} hours ago', {
					'hours': Math.floor(time / 60)
				});
			}
		}

	/*-------------------------------------------------------------------------
		Initialisation
	-------------------------------------------------------------------------*/

		objects.find(settings.items).each(function timeago() {
			var item = $(this),
				from = parse(item),
				to = new Date(),
				rel = say(from, to);

			// Set relative time
			if (rel) {
				item.text(rel);
			}
		});

	/*-----------------------------------------------------------------------*/

		return objects;
	};

})(window.jQuery, window.Symphony);
