import rpy2.robjects as ro
from flask import Flask, request, make_response, jsonify,  render_template
import dash
from flask_cors import CORS
from dash import html
from rpy2.robjects.packages import importr
from flask_htmlmin import HTMLMIN


# Initialize the Flask application
app = Flask(__name__)
app.config['MINIFY_HTML'] = True
htmlmin = HTMLMIN(app)
CORS(app)

# Initialize the Dash application
# dash_app = dash.Dash(__name__, server=app, url_base_pathname='/dashboard/')
#
# dash_app.layout = html.Div([
#     html.H1('File Contents'),
#     html.Div(id='output-data-upload')
# ])


@app.route('/')
def base():
    # content = html.Div([
    #     html.H1('Hello, Dash!'),
    #     html.P('This is some sample content generated with Dash.')
    # ])
    # return content
    return "hello"


# Define a Flask route that serves the Dash application as an HTML response
# @app.route('/dashboard/')
# def dashboard():
#     return dash_app.index()


@app.route('/preview/dataset', methods=['POST'])
def previewDatasets():
    utils = importr('utils')
    # Load an R package
    dplyr = importr('dplyr')

    # Read the file path from the request body
    path = request.json['path']
    print("Path jdnsjafjsbfjbdcsjkfbjdsbvjbdjvbdfjvbdfjbvjdfbvjdfbvjbfdvbf")
    print(path)
    r_file_path = ro.StrVector([path])
    ro.globalenv["r_file_path"] = r_file_path


    # path = request.args.get('filepath')

    # Load the CSV file into an R dataframe
    ro.r('''
        library(scater)
        library(SingleCellExperiment)
        library(AnnotationDbi)
        library(org.Hs.eg.db)
        library(EnsDb.Hsapiens.v86)
     ''')
    ro.r(f'''
    molecules <- read.delim(file.path(r_file_path,"molecules.txt"), sep = "\t", row.names = 1, stringsAsFactors = FALSE)
    ''')
    ro.r(
        f'annotation <- read.delim(file.path(r_file_path,"annotation.txt"), sep = "\t", stringsAsFactors = T)')
    r_molecules_df = ro.globalenv['molecules']
    r_annotations_df = ro.globalenv['annotation']
    # pandas_molecules_df = ro.conversion.rpy2py(r_molecules_df)
    # pandas_annotation_df = ro.conversion.rpy2py(r_annotations_df)
    # print("printing type of dataframe")
    # print(type(pandas_molecules_df))
    # Convert the R dataframes to pandas dataframes
    pandas_molecules_df = ro.conversion.rpy2py(r_molecules_df)
    pandas_annotation_df = ro.conversion.rpy2py(r_annotations_df)

    # Select the first 10 rows and 5 columns of the dataframes
    pandas_molecules_df = pandas_molecules_df.iloc[:6, :3]
    pandas_annotation_df = pandas_annotation_df.iloc[:6, :]

    # print(pandas_molecules_df.head(5))
    # print(pandas_annotation_df.head(5))

    ro.r(f'''
            sce <- SingleCellExperiment(assays=list(counts= as.matrix(molecules)), colData=annotation)
            altExp(sce,"ERCC") <- sce[grep("^ERCC-",rownames(sce)), ]
            sce <- sce[grep("^ERCC-",rownames(sce),invert = T), ]
            gene_names <- mapIds(org.Hs.eg.db, keys=rownames(sce), keytype="ENSEMBL", columns="SYMBOL",column="SYMBOL")

            rowData(sce)$SYMBOL <- gene_names
            table_geneNames <- table(is.na(gene_names))

            sce <- sce[! is.na(rowData(sce)$SYMBOL),] # Remove all genes for which no symbols were found
            temp1 <- grep("^MT-",rowData(sce)$SYMBOL,value = T) # Check if we can find mitochondrial proteins in the newly annotated symbols
            temp2 <- grep("^RP[LS]",rowData(sce)$SYMBOL,value = T)
            temp3 <- grep("ATP8",rowData(sce)$SYMBOL,value = T) # Quick search for mitochondrial protein ATP8, which is also called MT-ATP8
            temp4 <- columns(org.Hs.eg.db)

            ensdb_genes <- genes(EnsDb.Hsapiens.v86)
            MT_names <- ensdb_genes[seqnames(ensdb_genes) == "MT"]$gene_id
            is_mito <- rownames(sce) %in% MT_names
            temp5 <- table(is_mito)
    ''')

    # r_sce_df = ro.globalenv['sce']
    r_table_geneNames = ro.globalenv['table_geneNames']
    r_grep_not_mt = ro.globalenv['temp1']
    r_grep_not_rpls = ro.globalenv['temp2']
    r_grep_atp8 = ro.globalenv['temp3']
    r_columns = ro.globalenv['temp4']
    r_is_mitro = ro.globalenv['temp5']

    # print(r_table_geneNames)
    # print(r_grep_not_mt)
    # print(r_grep_not_rpls)
    # print(r_grep_atp8)
    # print(r_columns)
    # print(r_is_mitro)

    # Do something with the file path
    # return 'path: {}'.format(path)

    # content = html.Div([
    #     html.H1('Hello, Dash!'),
    #     html.P('This is some sample content generated with Dash.')
    # ])
    # return content

    # Create a Dash HTML div that contains the table and additional HTML
    # html_content = """
    # <div class="file-data">
    #   <h2>{}</h2>
    #   <div>{}</div>
    # </div>
    # """.format("karthik", "file_data")

    return render_template('previewDatasets.html', pandas_annotation_df=pandas_annotation_df, pandas_molecules_df=pandas_molecules_df, r_table_geneNames=r_table_geneNames,r_grep_not_mt=r_grep_not_mt,r_grep_not_rpls=r_grep_not_rpls, r_grep_atp8=r_grep_atp8, r_columns=r_columns, r_is_mitro=r_is_mitro)

    # # Render the layout as an HTML string
    # html_string = dash_app.layout.render(output_div)
    #
    # # Create a Flask HTTP response from the HTML string
    # response = make_response(html_string)
    #
    # # Set the content type of the response to 'text/html'
    # response.headers['Content-Type'] = 'text/html'
    #
    # # Return the response
    # return response

    # return html_content


if __name__ == "__main__":
    app.run()
