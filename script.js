$( 'a[href*="#"]' ).on( 'click', function( e ) {
	e.preventDefault()
	$( 'html, body' ).animate( {
		scrollTop: $( $( this ).attr( 'href' ) ).offset().top,
	}, 100, 'linear' )
} )
$( document ).ready( function() {
	alert( "This is a project website, I have express permission from the shop owner to use his images and content. This website is not completely representative of Knutsford IT " )
	// $('#mapModal').modal() 
	$( '#BTNmapModal' ).click( function() {
		// google.maps.event.trigger(map, "resize");
		$( '#mapModal' ).modal( 'show' )
	} );
	checkInput()

	function checkInput() {
		$( '#test' ).keyup( function() {
			var userInput = $( this ).val();
			if ( userInput.length >= 1 ) {
				console.log( userInput )
				loadDoc()
			}
		} );

		function loadDoc( userInput ) {
			var prob_title_array = [];
			var prob_description_array = [];
			var prob_fix_array = [];
			$.ajax( {
				url: 'data/BackendData.XML',
				type: 'GET',
				dataType: 'xml',
				success: function( returnedXMLResponse ) {
					console.log( "loaded XML" )
					parseXML( returnedXMLResponse )

					function parseXML( returnedXMLResponse ) {
						var problem = jQuery( returnedXMLResponse ).find( "problem" );
						for ( var i = 0; i < problem.length; i++ ) {
							var tmpprob_title_string
							var tmpprob_description_string
							var tmpprob_fix_string
							tmpprob_title_string = jQuery( problem[ i ] ).find( 'problem-title' ).text();
							prob_title_array.push( tmpprob_title_string );
							tmpprob_description_string = jQuery( problem[ i ] ).find( 'problem-description' ).text();
							prob_description_array.push( tmpprob_description_string );
							tmpprob_fix_string = jQuery( problem[ i ] ).find( 'fix' ).text();
							prob_fix_array.push( tmpprob_fix_string );
							$( '#test' ).autocomplete( {
								source: prob_title_array,
								open: function( event, ui ) {
									$( ".ui-autocomplete" ).hide();
								},
								response: function( event, ui ) {
									i = 0
									addMe = ui.content[ i ].label
									i++
									console.log( "addMe@autocomplete==" + addMe );
									getUniqueIdentifer( addMe, prob_title_array )
								}
							}, )
						};

						function getUniqueIdentifer( addMe, prob_title_array ) {
							var UniqueIdentifer = prob_title_array.indexOf( addMe )
							console.log( "UniqueIdentifer@getUniqueIdentifer==" + UniqueIdentifer )
							showResult( UniqueIdentifer, prob_title_array, prob_description_array, prob_fix_array )
						}

						function showResult( UniqueIdentifer, prob_title_array, prob_description_array, prob_fix_array ) {
							if ( document.getElementById( prob_title_array[ UniqueIdentifer ] ) == null ) {
								var optionNode = document.createElement( "button" );
								optionNode.className = "btnAU btn-block text-center"
								optionNode.setAttribute( "id", prob_title_array[ UniqueIdentifer ] )
								optionNode.appendChild( document.createTextNode( prob_title_array[ UniqueIdentifer ] ) );
								document.getElementById( "suggestionList" ).appendChild( optionNode );
								console.log( "found user input" )
								OpenDD = document.getElementById( "suggestionList" );
								OpenDD.style.display = "block";
								optionNode.onclick = function() {
									var clickedResults = this.id
									console.log( "from showResults ,clickedResults ==" + clickedResults + "from showResults addMe ==" + prob_title_array[ UniqueIdentifer ] )
									if ( clickedResults == prob_title_array[ UniqueIdentifer ] ) {
										$( '.modal-header' ).replaceWith( '<b>' + prob_title_array[ UniqueIdentifer ] + '</b>' )
										$( '.form-group-disc' ).replaceWith( '<b>Description:</b>' + prob_description_array[ UniqueIdentifer ] + '<br><br>' );
										$( '.form-group-fix' ).replaceWith( '<b>Fix:</b>' + prob_fix_array[ UniqueIdentifer ] )
										showFix()
										// getUniqueIdentifer()
									} else {
										return
									}
								}
							}
						}

						function showFix() {
							$( '#fixModal' ).modal( 'show' )
							$( '#fixModal' ).on( 'hidden.bs.modal', function( e ) {
								location.reload();
								// $('#fixModal').show();
							} )
							console.log( "cleared modal" )
						};
						//   userInput = null
						// prob_discription = null 
						// prob_title = null 
						// prob_fix = null
						//  checkInput()
					}
				}
			} )
		}
	}
} )